import type { AnyEventObject, EventObject, MachineSrc, StateSchema } from '@destyler/xstate'
import type { MachineOptions } from '../types'
import { onCleanup, onMount } from 'solid-js'

export function useService<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  const { state: hydratedState, context } = options ?? {}

  const service = (() => {
    const instance = typeof machine === 'function' ? machine() : machine
    const ctx = typeof context === 'function' ? context() : context
    if (ctx)
      instance.setContext(ctx)
    instance._created()
    return instance
  })()

  onMount(() => {
    service.start(hydratedState)

    onCleanup(() => {
      service.stop()
    })
  })

  return service
}
