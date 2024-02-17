import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { noop } from '@destyler/shared'
import type { Fn, Stoppable } from '@destyler/shared'
import { useTimeoutFn } from './use-timeout-fn'
import type { UseTimeoutFnOptions } from './use-timeout-fn'

export interface UseTimeoutOptions<Controls extends boolean> extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
  /**
   * Callback on timeout
   */
  callback?: Fn
}

export function useTimeout(interval?: number, options?: UseTimeoutOptions<false>): ComputedRef<boolean>
export function useTimeout(interval: number, options: UseTimeoutOptions<true>): { ready: ComputedRef<boolean> } & Stoppable
export function useTimeout(interval = 1000, options: UseTimeoutOptions<boolean> = {}) {
  const {
    controls: exposeControls = false,
    callback,
  } = options

  const controls = useTimeoutFn(
    callback ?? noop,
    interval,
    options,
  )

  const ready = computed(() => !controls.isPending.value)

  if (exposeControls) {
    return {
      ready,
      ...controls,
    }
  }
  else {
    return ready
  }
}
