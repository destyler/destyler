import type { AnyEventObject, EventObject, MachineSrc, StateSchema } from '@destyler/xstate'
import type { MachineOptions } from '../types'
import { useService } from './use-service'
import { useSnapshot } from './use-snapshot'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  const service = useService(machine, options)
  const state = useSnapshot(service, options)
  return [state, service.send, service] as const
}
