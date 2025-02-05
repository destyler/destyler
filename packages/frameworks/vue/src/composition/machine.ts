import type { MachineSrc, StateMachine } from '@zag-js/core'
import type { MachineOptions } from '../types'
import { useService } from './service'
import { useSnapshot } from './snapshot'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateMachine.StateSchema,
  TEvent extends StateMachine.EventObject = StateMachine.AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  const service = useService(machine, options)
  const state = useSnapshot(service, options)
  return [state, service.send, service] as const
}
