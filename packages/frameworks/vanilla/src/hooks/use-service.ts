import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
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

  // 启动服务（如果还没有启动）
  if (!service.state) {
    const stateInit = hydratedState
    service.start(stateInit)
  }

  return service
}
