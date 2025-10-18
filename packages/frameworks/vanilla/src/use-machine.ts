import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { useService } from './hooks/use-service'
import { useSnapshot } from './hooks/use-snapshot'

export function useMachine<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: HookOptions<TContext, TState, TEvent>,
) {
  // Scoped target object to isolate caches/subscriptions per call
  const target = {}
  const service = useService(target, machine, options)
  const state = useSnapshot(target, service, options)
  return { state, send: service.send, service }
}
