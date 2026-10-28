/// <reference types="react/experimental" />

import type { Snapshot } from '@destyler/store'
import type { AnyEventObject, EventObject, HookOptions, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, snapshot, subscribe } from '@destyler/store'
import { compact, isEqual } from '@destyler/utils'
import { affectedToPathList, createProxy as createProxyToCompare, isChanged } from 'proxy-compare'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useSafeLayoutEffect } from './use-layout-effect'
import { useUpdateEffect } from './use-update-effect'

const targetCache = globalRef('__destyler__targetCache', () => new WeakMap())

/**
 * proxy-compare keeps one handler per cached object and points it at whichever
 * affected map was passed to the latest `createProxy` call. A suspended render
 * shares that cache, so a later read from the committed tree would be stored on
 * the uncommitted map while the subscription still compares the committed one.
 *
 * The handler instead holds this router. Render and effect reads go to that
 * attempt's map. Event reads go to a retained map, which keeps the subscription
 * alive after the next committed render replaces its own map.
 */
class AffectedRouter extends WeakMap<object, unknown> {
  current: WeakMap<object, unknown>
  retained: WeakMap<object, unknown>

  private readonly markRetained: () => void

  constructor(retained: WeakMap<object, unknown>, markRetained: () => void) {
    super()
    this.current = retained
    this.retained = retained
    this.markRetained = markRetained
  }

  retargetRetained(retained: WeakMap<object, unknown>) {
    if (this.current === this.retained)
      this.current = retained
    this.retained = retained
  }

  /**
   * `isChanged` looks observations up by snapshot identity. Replay retained
   * paths onto the snapshot that is about to become the committed one.
   */
  replayRetainedPaths(previous: object, next: object) {
    const paths = affectedToPathList(previous, this.retained, true).filter(isRecordedPath)
    const seen = this.current
    this.current = this.retained
    try {
      const proxy = createProxyToCompare(next, this, new WeakMap(), targetCache) as Record<PropertyKey, unknown>
      for (const path of paths) {
        let cursor: unknown = proxy
        for (const key of path) {
          if (cursor == null || (typeof cursor !== 'object' && typeof cursor !== 'function'))
            break
          cursor = (cursor as Record<PropertyKey, unknown>)[key]
        }
      }
    }
    finally {
      this.current = seen
    }
  }

  override get(key: object) {
    return this.current.get(key)
  }

  override set(key: object, value: unknown) {
    this.current.set(key, value)
    if (this.current === this.retained)
      this.markRetained()
    return this
  }

  override has(key: object) {
    return this.current.has(key)
  }

  override delete(key: object) {
    return this.current.delete(key)
  }
}

interface AffectTracking {
  service: object
  retained: WeakMap<object, unknown>
  retainedUsed: boolean
  generation: number
  committedGeneration: number
  router: AffectedRouter
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
    generation: 0,
    committedGeneration: 0,
    router,
  }
  return tracking
}

function isRecordedPath(path: readonly (string | symbol)[]) {
  return path.length > 0 && path.every((segment) => {
    if (typeof segment === 'symbol')
      return true
    return segment !== ':ownKeys' && !segment.startsWith(':has(') && !segment.startsWith(':hasOwn(')
  })
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
  catch {
    return true
  }
  if (!tracking.retainedUsed)
    return false
  try {
    return isChanged(previous, next, tracking.retained, new WeakMap())
  }
  catch {
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
  const [tracking] = useState(() => createAffectTracking(service))

  if (tracking.service !== service) {
    tracking.service = service
    tracking.retained = new WeakMap()
    tracking.router.retargetRetained(tracking.retained)
    tracking.retainedUsed = false
  }

  const lastSnapshot = useRef<Snapshot<State>>(undefined)
  const lastAffected = useRef<WeakMap<object, unknown>>(undefined)
  const currAffected = new WeakMap<object, unknown>()
  const generation = ++tracking.generation
  tracking.router.current = currAffected

  const currSnapshot = useSyncExternalStore(
    useCallback(callback => subscribe(service.state, () => {
      const nextSnapshot = snapshot(service.state)
      if (!snapshotObservationChanged(lastSnapshot.current, nextSnapshot, lastAffected.current, tracking))
        return
      callback()
    }, notifyInSync), [service, notifyInSync, tracking]),
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

  useSafeLayoutEffect(() => {
    const previousSnapshot = lastSnapshot.current
    if (tracking.retainedUsed && previousSnapshot && previousSnapshot !== currSnapshot) {
      try {
        tracking.router.replayRetainedPaths(previousSnapshot, currSnapshot)
      }
      catch {
        // Replaying an observation is an optimization of the subscription.
        // Failing it must not break the commit that publishes this render.
      }
    }
    lastSnapshot.current = currSnapshot
    lastAffected.current = currAffected
    tracking.committedGeneration = generation
    // Layout and passive effects still extend this render's map. Event reads
    // move to the retained map only after those effects have run.
    tracking.router.current = currAffected
  })

  useEffect(() => {
    const committedGeneration = generation
    queueMicrotask(() => {
      if (tracking.committedGeneration !== committedGeneration)
        return
      tracking.router.current = tracking.retained
    })
  })

  // A suspended render never commits, so nothing above puts the router back on
  // the retained map. Restore once this attempt yields without committing.
  if (typeof document !== 'undefined') {
    queueMicrotask(() => {
      if (tracking.committedGeneration === generation)
        return
      if (tracking.router.current === currAffected)
        tracking.router.current = tracking.retained
    })
  }

  const proxyCache = useMemo(() => new WeakMap(), []) // per-hook proxyCache

  return createProxyToCompare(currSnapshot, tracking.router, proxyCache, targetCache) as any
}
