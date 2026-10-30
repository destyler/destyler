import type { AnyEventObject, EventObject, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, subscribe } from '@destyler/store'
import { createProxy as createProxyToCompare, isChanged } from 'proxy-compare'
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'

const targetCache = globalRef('__destyler__targetCache', () => new WeakMap<object, unknown>())

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  service: Machine<TContext, TState, TEvent>,
  options?: { sync?: boolean },
): XState<TContext, TState, TEvent> {
  type State = XState<TContext, TState, TEvent>
  const sync = options?.sync
  // A proxy must never be retargeted to another observation map. Keep the map
  // and cache together for this hook/service; reads on reused immutable objects
  // accumulate conservatively, including reads from an abandoned render.
  const tracking = useMemo(() => ({
    affected: new WeakMap<object, unknown>(),
    proxyCache: new WeakMap<object, unknown>(),
  }), [service])
  const committed = useRef<{
    service: typeof service
    snapshot: State
    affected: WeakMap<object, unknown>
  } | undefined>(undefined)
  const subscribeToState = useCallback((callback: () => void) => subscribe(service.state, () => {
    const previous = committed.current
    try {
      if (previous?.service === service
        && !isChanged(previous.snapshot, service.getState(), previous.affected, new WeakMap())) {
        return
      }
    }
    catch {
      // A failed comparison must notify rather than hide a possible change.
    }
    callback()
  }, sync), [service, sync])
  const getSnapshot = useCallback(() => service.getState(), [service])
  const current = useSyncExternalStore(subscribeToState, getSnapshot, getSnapshot)

  useEffect(() => {
    committed.current = { service, snapshot: current, affected: tracking.affected }
  })

  // React receives the cached raw snapshot above. This stable wrapper only
  // tracks access; useSelector provides explicit, read-independent membership.
  return createProxyToCompare(current, tracking.affected, tracking.proxyCache, targetCache)
}
