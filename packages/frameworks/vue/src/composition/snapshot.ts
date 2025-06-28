import type { AnyEventObject, EventObject, Machine, StateSchema, XState } from '@destyler/xstate'
import type { Ref } from 'vue'
import type { MachineOptions } from '../types'
import { snapshot, subscribe } from '@destyler/store'
import { onUnmounted, shallowRef, unref, watch, watchEffect } from 'vue'

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  service: Machine<TContext, TState, TEvent>,
  options?: MachineOptions<TContext, TState, TEvent>,
): Ref<XState<TContext, TState, TEvent>> {
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
