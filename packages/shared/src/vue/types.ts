import type { Ref, WatchSource } from 'vue'

export type Fn = () => void

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

export interface Stoppable<StartFnArgs extends any[] = any[]> {
  /**
   * A ref indicate whether a stoppable instance is executing
   */
  isPending: Readonly<Ref<boolean>>

  /**
   * Stop the effect from executing
   */
  stop: Fn

  /**
   * Start the effects
   */
  start: (...args: StartFnArgs) => void
}

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never

export type Awaited<T> =
  T extends null | undefined ? T :
    T extends object & { then: (onfulfilled: infer F, ...args: infer _) => any } ?
      F extends ((value: infer V, ...args: infer _) => any) ?
        Awaited<V> :
        never :
      T

export type Promisify<T> = Promise<Awaited<T>>

export type PromisifyFn<T extends AnyFn> = (...args: ArgumentsType<T>) => Promisify<ReturnType<T>>

export interface Pausable {
  /**
   * A ref indicate whether a pausable instance is active
   */
  isActive: Readonly<Ref<boolean>>

  /**
   * Temporary pause the effect from executing
   */
  pause: Fn

  /**
   * Resume the effects
   */
  resume: Fn
}

export type MultiWatchSources = (WatchSource<unknown> | object)[]

export type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}
export type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}
