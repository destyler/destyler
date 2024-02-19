import { watch } from 'vue'
import { tryOnScopeDispose, unrefElement } from '@destyler/shared'
import type { MaybeComputedElementRef } from '@destyler/shared'
import type { ConfigurableWindow } from './use-resize-observer'
import { defaultWindow } from './use-resize-observer'
import { useSupported } from './use-supported'

export interface UseMutationObserverOptions extends MutationObserverInit, ConfigurableWindow {}

export function useMutationObserver(
  target: MaybeComputedElementRef,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
) {
  const { window = defaultWindow, ...mutationOptions } = options
  let observer: MutationObserver | undefined
  const isSupported = useSupported(() => window && 'MutationObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    () => unrefElement(target),
    (el) => {
      cleanup()

      if (isSupported.value && window && el) {
        observer = new MutationObserver(callback)
        observer!.observe(el, mutationOptions)
      }
    },
    { immediate: true },
  )

  const takeRecords = () => {
    return observer?.takeRecords()
  }

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
    takeRecords,
  }
}

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>
