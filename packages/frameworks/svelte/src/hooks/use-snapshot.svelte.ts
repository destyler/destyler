import type { AnyEventObject, EventObject, Machine, StateSchema } from '@destyler/xstate'
import { onDestroy } from 'svelte'
import { reflect } from '../utils/reflect'

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(service: Machine<TContext, TState, TEvent>) {
  let state = $state(service.state)

  const unsubscribe = service.subscribe((nextState) => {
    state = nextState
  })

  onDestroy(unsubscribe)

  return reflect(() => state)
}
