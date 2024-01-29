import type { Ref } from 'vue'
import { readonly, shallowRef, watch } from 'vue'
import type { MaybeRefOrGetter } from '@destyler/shared'
import { toRef } from '@destyler/shared'

/**
 * Holds the previous value of a ref.
 */
export function usePrevious<T>(value: MaybeRefOrGetter<T>): Readonly<Ref<T | undefined>>
export function usePrevious<T>(value: MaybeRefOrGetter<T>, initialValue: T): Readonly<Ref<T>>
export function usePrevious<T>(value: MaybeRefOrGetter<T>, initialValue?: T) {
  const previous = shallowRef<T | undefined>(initialValue)

  watch(
    toRef(value),
    (_, oldValue) => {
      previous.value = oldValue
    },
    { flush: 'sync' },
  )

  return readonly(previous)
}
