import type { AnyEventObject, EventObject, HookOptions, MachineSrc, StateSchema } from '@destyler/xstate'
import { onMount } from 'svelte'

export function useService<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: HookOptions<TContext, TState, TEvent>) {
  const service = typeof machine === 'function' ? machine() : machine

  const contextSnapshot = $state.snapshot(options?.context)
  // @ts-expect-error - svelte typing issue
  service.setContext(contextSnapshot)

  service._created()

  $effect(() => {
    if (!options?.actions)
      return
    const actionSnapshot = $state.snapshot(options.actions)
    // @ts-expect-error - svelte typing issue
    service.setOptions({ actions: actionSnapshot })
  })

  $effect(() => {
    const contextSnapshot = $state.snapshot(options?.context)
    // @ts-expect-error - svelte typing issue
    service.setContext(contextSnapshot)
  })

  onMount(() => {
    service.start(options?.state)
    return service.stop
  })

  return service
}
