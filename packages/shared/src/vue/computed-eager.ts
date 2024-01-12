import type { Ref, WatchOptionsBase } from 'vue'
import { readonly, shallowRef, watchEffect } from 'vue'

/**
 * @param fn effect function
 * @param options WatchOptionsBase
 * @returns readonly ref
 */
export function computedEager<T>(fn: () => T, options?: WatchOptionsBase): Readonly<Ref<T>> {
  const result = shallowRef()

  watchEffect(() => {
    result.value = fn()
  }, {
    ...options,
    flush: options?.flush ?? 'sync',
  })

  return readonly(result)
}

// alias
export { computedEager as eagerComputed }
