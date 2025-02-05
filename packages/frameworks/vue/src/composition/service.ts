import type { MachineSrc, StateMachine } from '@zag-js/core'
import type { MachineOptions } from '../types'
import { onBeforeUnmount, onMounted, unref } from 'vue'

export function useService<
  TContext extends Record<string, any>,
  TState extends StateMachine.StateSchema,
  TEvent extends StateMachine.EventObject = StateMachine.AnyEventObject,
>(machine: MachineSrc<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  const { state: hydratedState, context } = options ?? {}

  const service = typeof machine === 'function' ? machine() : machine
  if (context)
    service.setContext(unref(context))
  service._created()

  onMounted(() => {
    service.start(hydratedState)

    onBeforeUnmount(() => {
      service.stop()
    })
  })

  return service
}
