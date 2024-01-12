import type { Ref } from 'vue'

/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any

/**
 * Maybe it's a ref, or a plain value
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>

/**
 * Maybe it's a ref, or a plain value, or a getter function
 *
 * ```ts
 * type MaybeRefOrGetter<T> = (() => T) | T | Ref<T> | ComputedRef<T>
 * ```
 */
export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)
