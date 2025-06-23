import type { Ref, UnwrapRef } from 'vue'
import { type ControlRecord, type ControlValue, deepGet, deepSet, getControlDefaults } from '@destyler/shared-private'
import { computed, ref, unref } from 'vue'

export interface UseControlsReturn<T extends ControlRecord> {
  config: T
  context: Ref<UnwrapRef<ControlValue<T>>>
  setState: (key: string, value: any) => void
  getState: (key: string) => any
  keys: (keyof T)[]
}

export function useControls<T extends ControlRecord>(config: T): UseControlsReturn<T> {
  const state = ref<any>(getControlDefaults(config))

  const setState = (key: string, value: any) => {
    const newState = unref(state)
    deepSet(newState, key, value)
    state.value = newState
  }

  const getState = (key: string) => {
    return computed(() => deepGet(unref(state), key))
  }

  return {
    config,
    context: state,
    setState,
    getState,
    keys: Object.keys(config) as (keyof ControlValue<T>)[],
  }
}
