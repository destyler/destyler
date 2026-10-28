/// <reference types="react/experimental" />

import type { Snapshot } from '@destyler/store'
import type { AnyEventObject, EventObject, HookOptions, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, snapshot, subscribe } from '@destyler/store'
import { compact, isEqual } from '@destyler/utils'
import { createProxy as createProxyToCompare, isChanged } from 'proxy-compare'
import * as ReactNamespace from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { useUpdateEffect } from './use-update-effect'

const targetCache = globalRef('__destyler__targetCache', () => new WeakMap())

// proxy-compare's affected record. These keys hold the real property keys,
// including symbols, which `affectedToPathList` would stringify.
const HAS_KEY = 'h'
const ALL_OWN_KEYS = 'w'
const HAS_OWN_KEY = 'o'
const KEYS = 'k'

interface AffectedUsed {
  [HAS_KEY]?: Set<PropertyKey>
  [ALL_OWN_KEYS]?: true
  [HAS_OWN_KEY]?: Set<PropertyKey>
  [KEYS]?: Set<PropertyKey>
}

interface RenderAttempt {
  readonly id: object
  readonly map: WeakMap<object, unknown>
}

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
  /**
   * Attempt opened by the hook body. The next render replaces it, so a
   * discarded attempt's map is dropped instead of merged into `retained`.
   */
  openAttempt: RenderAttempt
  /** Identity of the attempt published by the layout effect. */
  committedAttemptId: object | null
  /** Map published by the last commit. Effect reads extend this object. */
  committed: WeakMap<object, unknown>
  /** Event observations. Only grows until this router is discarded. */
  readonly retained: WeakMap<object, unknown>
  /**
   * `'effect'` from the commit's layout effect until passive effects finish,
   * then `'event'`. A yielded or discarded render does not change this.
   */
  phase: 'effect' | 'event'
  /** Replay must record into `retained` even if a commit is still in the effect phase. */
  private replaying = false

  private readonly markRetained: () => void

  constructor(retained: WeakMap<object, unknown>, markRetained: () => void) {
    super()
    this.openAttempt = { id: {}, map: new WeakMap() }
    this.committedAttemptId = null
    this.committed = new WeakMap()
    this.retained = retained
    this.phase = 'event'
    this.markRetained = markRetained
  }

  /**
   * `isChanged` looks observations up by snapshot identity. Replay retained
   * paths, including `in` and `ownKeys`, onto the snapshot that is about to
   * become the committed one. Symbol keys stay symbols; the string form
   * `:has(Symbol(...))` cannot recover them.
   */
  replayRetainedPaths(previous: object, next: object) {
    this.replaying = true
    try {
      const proxy = createProxyToCompare(next, this, new WeakMap(), targetCache)
      replayAffected(proxy, previous, this.retained, new WeakSet())
    }
    finally {
      this.replaying = false
    }
  }

  private select(): WeakMap<object, unknown> {
    if (this.replaying)
      return this.retained
    // A later slice of this attempt still has React's render dispatcher, so
    // its reads stay on the open attempt. An event after a discarded attempt
    // does not, and must not inherit that attempt's map.
    if (isReactRendering())
      return this.openAttempt.map
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

const HOOK_SLOTS = ['useState', 'useEffect', 'useMemo', 'useRef', 'useCallback'] as const

function readDispatcher(): object | null | undefined {
  const react = ReactNamespace as unknown as Record<string, unknown>
  // React 19.
  const client = react.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  if (client && typeof client === 'object' && 'H' in client)
    return (client as { H?: object | null }).H ?? null
  // React 18.
  const secret = react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  const current = secret && typeof secret === 'object'
    ? (secret as { ReactCurrentDispatcher?: { current?: object | null } }).ReactCurrentDispatcher
    : undefined
  if (current && typeof current === 'object' && 'current' in current)
    return current.current ?? null
  // Unknown build. Callers fail safe.
  return undefined
}

function isReactRendering(): boolean {
  const dispatcher = readDispatcher()
  // Missing internals, or a dispatcher React has not installed. Treat the
  // read as a render so it cannot be stored in `retained`.
  if (dispatcher == null)
    return true
  const slots = HOOK_SLOTS.map(name => (dispatcher as Record<string, unknown>)[name])
  if (slots.some(slot => typeof slot !== 'function'))
    return true
  const [first, ...rest] = slots
  // Context-only dispatchers in React 18 and 19 share one invalid-hook
  // function across every slot. Anything else is a render, or an unknown
  // shape that must not leak into `retained`.
  return !rest.every(slot => slot === first)
}

function replayAffected(proxy: object, source: object, affected: WeakMap<object, unknown>, seen: WeakSet<object>) {
  if (seen.has(source))
    return
  seen.add(source)
  const used = affected.get(source) as AffectedUsed | undefined
  if (!used)
    return
  const record = proxy as Record<PropertyKey, unknown>
  const sourceRecord = source as Record<PropertyKey, unknown>
  used[KEYS]?.forEach((key) => {
    const child = record[key]
    const sourceChild = sourceRecord[key]
    if (child != null && sourceChild != null && typeof child === 'object' && typeof sourceChild === 'object')
      replayAffected(child as object, sourceChild as object, affected, seen)
  })
  // `in` and getOwnPropertyDescriptor keep the original key, symbol or string.
  used[HAS_KEY]?.forEach((key) => {
    void (key in proxy)
  })
  used[HAS_OWN_KEY]?.forEach((key) => {
    Reflect.getOwnPropertyDescriptor(proxy, key)
  })
  if (used[ALL_OWN_KEYS] === true)
    Reflect.ownKeys(proxy)
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
  // This attempt's identity is replaced on the next render. Children in a
  // later slice still read `openAttempt`; a discarded attempt is not committed
  // and is never copied into `retained`.
  const attempt: RenderAttempt = { id: {}, map: currAffected }
  tracking.router.openAttempt = attempt

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
    tracking.router.committedAttemptId = attempt.id
    // Passive effects still extend this commit. Event reads move to `retained`
    // only after those effects, not from a microtask queued during render.
    tracking.router.phase = 'effect'
  })

  useEffect(() => {
    const attemptId = attempt.id
    const router = tracking.router
    queueMicrotask(() => {
      if (router.phase === 'effect' && router.committedAttemptId === attemptId)
        router.phase = 'event'
    })
  })

  const proxyCache = useMemo(() => new WeakMap(), []) // per-hook proxyCache

  return createProxyToCompare(currSnapshot, tracking.router, proxyCache, targetCache) as any
}
