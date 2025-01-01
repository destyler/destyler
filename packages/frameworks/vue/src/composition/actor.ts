import type { Machine, StateMachine } from '@zag-js/core'
import { useSnapshot } from './snapshot'

export function useActor<
  TContext extends Record<string, any>,
  TState extends StateMachine.StateSchema,
  TEvent extends StateMachine.EventObject = StateMachine.AnyEventObject,
>(service: Machine<TContext, TState, TEvent>) {
  const state = useSnapshot(service)
  return [state, service.send] as const
}
