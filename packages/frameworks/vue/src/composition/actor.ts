import type { AnyEventObject, EventObject, Machine, StateSchema, XState } from '@destyler/xstate'
import type { Ref } from 'vue'
import { useSnapshot } from './snapshot'

export function useActor<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(service: Machine<TContext, TState, TEvent>): readonly [
  Ref<XState<TContext, TState, TEvent>>,
  Machine<TContext, TState, TEvent>['send'],
] {
  const state = useSnapshot(service)
  return [state, service.send] as const
}
