import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { MachineStatus } from '@destyler/xstate'
import { useConstant } from './use-constant'

export function useService<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  target: object,
  machine: MachineSrc<TContext, TState, TEvent>,
  options?: HookOptions<TContext, TState, TEvent>,
) {
  const { state: hydratedState, context } = options ?? {}

  const service = useConstant(target, 'service', () => {
    const instance = typeof machine === 'function' ? machine() : machine
    if (context)
      instance.setContext(context)
    instance._created()
    return instance
  })

  // Start the service if it's not already running. `service.state` is always defined,
  // so we need to rely on the machine status instead of the presence of state.
  if (service.status !== MachineStatus.Running) {
    const stateInit = hydratedState
    service.start(stateInit)
  }

  return service
}
