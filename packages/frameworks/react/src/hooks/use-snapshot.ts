/// <reference types="react/experimental" />

import type { Snapshot } from '@destyler/store'
import type { AnyEventObject, EventObject, HookOptions, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, snapshot, subscribe } from '@destyler/store'
import { compact, isEqual } from '@destyler/utils'
import { affectedToPathList, createProxy as createProxyToCompare, isChanged } from 'proxy-compare'
import * as ReactNamespace from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { useUpdateEffect } from './use-update-effect'

const targetCache = globalRef('__destyler__targetCache', () => new WeakMap())

const HAS_SEGMENT = /^:has\((.*)\)$/
const HAS_OWN_SEGMENT = /^:hasOwn\((.*)\)$/

/**
 * proxy-compare keeps one handler per cached object and points it at whichever
 * affected map was passed to the latest `createProxy` call. A suspended render
 * shares that cache, so a later read from the committed tree would be stored on
 * the uncommitted map while the subscription still compares the committed one.
 *
 * The handler holds this router instead of a map. `get` / `set` / `has` /
 * `delete` forward to whichever map the read belongs to:
 *
 * - While React is rendering (including a later slice of the same attempt),
 *   reads go to that attempt's map. A discarded attempt is never copied out.
 * - Layout and passive effects extend the map published by the commit.
 * - Event reads go to `retained`.
 *
 * `retained` only grows. A field read once from an event stays subscribed for
 * the life of this hook instance, until `service` changes and the tracking
 * object is replaced. Every commit replays those paths onto the new snapshot.
 * A handler that walks a large context pays that walk on every committed render.
 *
 * `super()` storage is unused on purpose. proxy-compare only calls `get`,
 * `set`, `has`, and `delete`; those overrides select the map above. Writing
 * the base WeakMap would record the read in a place `isChanged` never sees.
 */
class AffectedRouter extends WeakMap<object, unknown> {
  /** Map for the render attempt currently executing. Not part of the subscription. */
  attempt: WeakMap<object, unknown>
  /** Map published by the last commit. Effect reads extend this object. */
  committed: WeakMap<object, unknown>
  /** Event observations. Only grows until this router is discarded. */
  readonly retained: WeakMap<object, unknown>
  /**
   * `'effect'` from the commit's layout effect until passive effects finish,
   * then `'event'`. A yielded or discarded render does not change this.
   */
  phase: 'effect' | 'event'

  private readonly markRetained: () => void

  constructor(retained: WeakMap<object, unknown>, markRetained: () => void) {
    super()
    this.attempt = new WeakMap()
    this.committed = new WeakMap()
    this.retained = retained
    this.phase = 'event'
    this.markRetained = markRetained
  }

  /**
   * `isChanged` looks observations up by snapshot identity. Replay retained
   * paths, including `in` (`:has`) and `ownKeys`, onto the snapshot that is
   * about to become the committed one.
   */
  replayRetainedPaths(previous: object, next: object) {
    const paths = affectedToPathList(previous, this.retained, true)
    const proxy = createProxyToCompare(next, this, new WeakMap(), targetCache)
    for (const path of paths)
      replayPath(proxy, path)
  }

  private select(): WeakMap<object, unknown> {
    // React installs the hooks dispatcher for the whole render attempt,
    // including a child rendered in a later slice, and restores the
    // context-only dispatcher when the attempt yields or ends. Selecting
    // here avoids a microtask that would otherwise run between those slices.
    if (isReactRendering())
      return this.attempt
    if (this.phase === 'effect')
      return this.committed
    return this.retained
  }

  override get(key: object) {
    return this.select().get(key)
  }

  override set(key: object, value: unknown) {
    const map = this.select()
    map.set(key, value)
    if (map === this.retained)
      this.markRetained()
    return this
  }

  override has(key: object) {
    return this.select().has(key)
  }

  override delete(key: object) {
    return this.select().delete(key)
  }
}

interface AffectTracking {
  readonly service: object
  readonly retained: WeakMap<object, unknown>
  retainedUsed: boolean
  readonly router: AffectedRouter
}

function createAffectTracking(service: object): AffectTracking {
  const retained = new WeakMap<object, unknown>()
  let tracking: AffectTracking
  const router = new AffectedRouter(retained, () => {
    tracking.retainedUsed = true
  })
  tracking = {
    service,
    retained,
    retainedUsed: false,
    router,
  }
  return tracking
}

interface ReactDispatcher {
  useState?: unknown
  useEffect?: unknown
}

// React does not declare this field. It is the same shared dispatcher every
// renderer (DOM, React Native, test renderer, server) writes during render.
const clientInternals = (ReactNamespace as unknown as {
  __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: { H: ReactDispatcher | null }
}).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE

function isReactRendering(): boolean {
  const dispatcher = clientInternals?.H
  if (!dispatcher)
    return false
  // Outside render, every hook slot is the same invalid-hook thrower.
  // During render, `useState` and `useEffect` are distinct implementations.
  return dispatcher.useState !== dispatcher.useEffect
}

function replayPath(proxy: object, path: readonly (string | symbol)[]) {
  let cursor: unknown = proxy
  for (let index = 0; index < path.length; index++) {
    if (cursor == null || (typeof cursor !== 'object' && typeof cursor !== 'function'))
      return
    const segment = path[index]!
    const last = index === path.length - 1
    if (typeof segment === 'string' && last) {
      if (segment === ':ownKeys') {
        Reflect.ownKeys(cursor)
        return
      }
      const has = HAS_SEGMENT.exec(segment)
      if (has) {
        void (has[1]! in cursor)
        return
      }
      const hasOwn = HAS_OWN_SEGMENT.exec(segment)
      if (hasOwn) {
        Reflect.getOwnPropertyDescriptor(cursor, hasOwn[1]!)
        return
      }
    }
    cursor = (cursor as Record<PropertyKey, unknown>)[segment]
  }
}

function warnSnapshotObservation(message: string, error: unknown) {
  // Bundlers inline NODE_ENV. Importing `node:process` would ship Node into the client build.
  // eslint-disable-next-line node/prefer-global/process
  if (process.env.NODE_ENV === 'production')
    return
  console.warn(`[useSnapshot] ${message}`, error)
}

function snapshotObservationChanged(
  previous: object | undefined,
  next: object,
  affected: WeakMap<object, unknown> | undefined,
  tracking: AffectTracking,
) {
  if (!previous || !affected)
    return true
  try {
    if (isChanged(previous, next, affected, new WeakMap()))
      return true
  }
  catch (error) {
    warnSnapshotObservation('failed to compare render observations', error)
    return true
  }
  if (!tracking.retainedUsed)
    return false
  try {
    return isChanged(previous, next, tracking.retained, new WeakMap())
  }
  catch (error) {
    warnSnapshotObservation('failed to compare retained event observations', error)
    return true
  }
}

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  service: Machine<TContext, TState, TEvent>,
  options?: HookOptions<TContext, TState, TEvent> & { sync?: boolean },
): XState<TContext, TState, TEvent> {
  //
  type State = XState<TContext, TState, TEvent>

  const { actions, context, sync: notifyInSync } = options ?? {}
  // A new service gets a new tracking object. A discarded render must not
  // mutate the committed instance, so this is keyed here instead of reset
  // by writing into the previous object during render.
  const tracking = useMemo(() => createAffectTracking(service), [service])

  const lastSnapshot = useRef<Snapshot<State>>(undefined)
  const lastAffected = useRef<WeakMap<object, unknown>>(undefined)
  const currAffected = new WeakMap<object, unknown>()
  // Children and the rest of this attempt read the proxy after this hook
  // returns, including in a later slice. Point the attempt map at this render
  // without touching `retained`.
  tracking.router.attempt = currAffected

  const currSnapshot = useSyncExternalStore(
    useCallback(callback => subscribe(service.state, () => {
      const nextSnapshot = snapshot(service.state)
      if (!snapshotObservationChanged(lastSnapshot.current, nextSnapshot, lastAffected.current, tracking))
        return
      callback()
    }, notifyInSync), [service, notifyInSync]),
    () => snapshot(service.state),
    () => snapshot(service.state),
  )

  service.setOptions({ actions })

  const ctx = useMemo(() => compact(context ?? {}), [context])

  useUpdateEffect(() => {
    const entries = Object.entries(ctx)

    const previousCtx = service.contextSnapshot ?? {}

    const equality = entries.map(([key, value]) => ({
      key,
      curr: value,
      prev: previousCtx[key],
      equal: isEqual(previousCtx[key], value),
    }))

    const allEqual = equality.every(({ equal }) => equal)

    if (!allEqual) {
      // console.log(equality.filter(({ equal }) => !equal))
      service.setContext(ctx)
    }
  }, [ctx])

  useLayoutEffect(() => {
    const previousSnapshot = lastSnapshot.current
    if (tracking.retainedUsed && previousSnapshot && previousSnapshot !== currSnapshot) {
      try {
        tracking.router.replayRetainedPaths(previousSnapshot, currSnapshot)
      }
      catch (error) {
        // Replaying an observation must not break the commit. The warning is
        // dev-only so a bad path is visible without changing the subscription.
        warnSnapshotObservation('failed to replay retained observations', error)
      }
    }
    lastSnapshot.current = currSnapshot
    lastAffected.current = currAffected
    tracking.router.committed = currAffected
    // Passive effects still extend this commit. Event reads move to `retained`
    // only after those effects, not from a microtask queued during render.
    tracking.router.phase = 'effect'
  })

  useEffect(() => {
    const attempt = currAffected
    const router = tracking.router
    queueMicrotask(() => {
      if (router.phase === 'effect' && router.committed === attempt)
        router.phase = 'event'
    })
  })

  const proxyCache = useMemo(() => new WeakMap(), []) // per-hook proxyCache

  return createProxyToCompare(currSnapshot, tracking.router, proxyCache, targetCache) as any
}
