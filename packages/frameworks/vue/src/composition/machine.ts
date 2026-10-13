import type { AnyEventObject, EventObject, Machine, MachineSrc, StateSchema, XState } from '@destyler/xstate'
import type { Ref } from 'vue'
import type { MachineOptions } from '../types'
import { useService } from './service'
import { useSnapshot } from './snapshot'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>,
): readonly [
  Ref<XState<TContext, TState, TEvent>>,
  Machine<TContext, TState, TEvent>['send'],
  Machine<TContext, TState, TEvent>,
] {
  const service = useService(machine, options)
  const state = useSnapshot(service, options)
  return [state, service.send, service] as const
}
