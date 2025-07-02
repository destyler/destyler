import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useService } from './use-service'
import { useSnapshot } from './use-snapshot'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  target: object,
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: HookOptions<TContext, TState, TEvent>,
) {
  const service = useService(target, machine, options)
  const state = useSnapshot(target, service, options)
  return [state, service.send, service] as const
}
