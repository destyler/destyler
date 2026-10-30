import type { AnyEventObject, EventObject, Machine, StateSchema, XState } from '@destyler/xstate'
import { subscribe } from '@destyler/store'
import { useCallback, useSyncExternalStore } from 'react'

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  service: Machine<TContext, TState, TEvent>,
  options?: { sync?: boolean },
): XState<TContext, TState, TEvent> {
  const sync = options?.sync
  const subscribeToState = useCallback(
    (callback: () => void) => subscribe(service.state, callback, sync),
    [service, sync],
  )
  const getSnapshot = useCallback(() => service.getState(), [service])
  // Observe the whole immutable value, including reference-only dependencies.
  // Property reads cannot reveal how React consumes object identity. Consumers
  // needing a narrower subscription use useSelector with explicit equality.
  return useSyncExternalStore(subscribeToState, getSnapshot, getSnapshot)
}
