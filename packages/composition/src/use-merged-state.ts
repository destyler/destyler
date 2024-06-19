import type { ComputedRef, Ref } from 'vue'
import { computed, watch } from 'vue'

export function useMergedState<T>(
  controlledStateRef: Ref<T | undefined>,
  uncontrolledStateRef: Ref<T>,
): ComputedRef<T> {
  watch(controlledStateRef, (value) => {
    if (value !== undefined) {
      uncontrolledStateRef.value = value
    }
  })
  return computed(() => {
    if (controlledStateRef.value === undefined) {
      return uncontrolledStateRef.value
    }
    return controlledStateRef.value
  })
}
