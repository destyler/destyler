import type { Machine, StateMachine } from '@zag-js/core'
import type { MachineOptions } from '../types'
import { snapshot, subscribe } from '@zag-js/store'
import { onUnmounted, type Ref, shallowRef, unref, watch, watchEffect } from 'vue'

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateMachine.StateSchema,
  TEvent extends StateMachine.EventObject = StateMachine.AnyEventObject,
>(
  service: Machine<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>,
): Ref<StateMachine.State<TContext, TState, TEvent>> {
  const { actions, context } = options ?? {}

  const state = shallowRef(service.state)

  const unsubscribe = subscribe(service.state, () => {
    state.value = snapshot(service.state) as any
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  watchEffect(() => {
    service.setOptions({ actions })
  })

  if (context) {
    watch(
      context,
      (ctx) => {
        service.setContext(unref(ctx))
      },
      { deep: true },
    )
  }

  return state
}
