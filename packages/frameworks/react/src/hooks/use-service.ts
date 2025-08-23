import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateInit, StateSchema } from '@destyler/xstate'
import { useRef } from 'react'
import { useConstant } from './use-constant'
import { useSafeLayoutEffect } from './use-layout-effect'

export function useService<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  const { state: hydratedState, context } = options ?? {}

  const service = useConstant(() => {
    const instance = typeof machine === 'function' ? machine() : machine
    if (context)
      instance.setContext(context)
    instance._created()
    return instance
  })

  const snapshotRef = useRef<StateInit<TContext, TState>>(undefined)

  useSafeLayoutEffect(() => {
    const stateInit = hydratedState ?? snapshotRef.current
    service.start(stateInit)
    return () => {
      service.stop()
    }
  }, [])

  return service
}
