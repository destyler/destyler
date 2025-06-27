import type { AnyEventObject, EventObject, Machine, StateSchema } from '@destyler/xstate'
import { useSnapshot } from './use-snapshot'

export function useActor<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(service: Machine<TContext, TState, TEvent>) {
  const state = useSnapshot(service)
  return [state, service.send] as const
}
