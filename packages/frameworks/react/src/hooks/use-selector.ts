import type { EventObject, Machine, StateSchema, XState } from '@destyler/xstate'
import { subscribe } from '@destyler/store'
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'

/** Subscribe to a selected immutable value, retaining it while isEqual succeeds. */
export function useSelector<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject,
  TSelected,
>(
  service: Machine<TContext, TState, TEvent>,
  selector: (state: XState<TContext, TState, TEvent>) => TSelected,
  isEqual: (previous: TSelected, next: TSelected) => boolean = Object.is,
): TSelected {
  const committed = useRef<{ value: TSelected } | undefined>(undefined)
  const subscribeToState = useCallback(
    (callback: () => void) => subscribe(service.state, callback),
    [service],
  )

  const getSelection = useMemo(() => {
    // Keep speculative cache state in this getter, not a shared render-time ref.
    // A new selector can reuse an equal committed result without retargeting
    // the getter still used by the committed subscription.
    let cached: { snapshot: XState<TContext, TState, TEvent>, value: TSelected } | undefined
    return () => {
      const snapshot = service.getState()
      if (cached && Object.is(cached.snapshot, snapshot))
        return cached.value

      let value = selector(snapshot)
      const previous = cached ?? committed.current
      if (previous && isEqual(previous.value, value))
        value = previous.value

      // Do not cache a snapshot whose selector or equality comparison threw.
      cached = { snapshot, value }
      return value
    }
  }, [service, selector, isEqual])

  const selection = useSyncExternalStore(subscribeToState, getSelection, getSelection)
  useEffect(() => {
    committed.current = { value: selection }
  }, [selection])
  return selection
}
