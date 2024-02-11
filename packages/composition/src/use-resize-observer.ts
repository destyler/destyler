import type { MaybeComputedElementRef } from '@destyler/shared'
import { isClient, tryOnScopeDispose, unrefElement } from '@destyler/shared'
import { computed, watch } from 'vue'

import { useSupported } from './use-supported'

export interface ConfigurableWindow {
  window?: Window
}

export const defaultWindow = isClient ? window : undefined

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

export interface UseResizeObserverOptions extends ConfigurableWindow {
  /**
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback)
  disconnect(): void
  observe(target: Element, options?: UseResizeObserverOptions): void
  unobserve(target: Element): void
}

/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @param target
 * @param callback
 * @param options
 */
export function useResizeObserver(
  target: MaybeComputedElementRef | MaybeComputedElementRef[],
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
) {
  const { window = defaultWindow, ...observerOptions } = options
  let observer: ResizeObserver | undefined
  const isSupported = useSupported(() => window && 'ResizeObserver' in window)

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = computed(() =>
    Array.isArray(target)
      ? target.map(el => unrefElement(el))
      : [unrefElement(target)])

  const stopWatch = watch(
    targets,
    (els) => {
      cleanup()
      if (isSupported.value && window) {
        observer = new ResizeObserver(callback)
        for (const _el of els)
          _el && observer!.observe(_el, observerOptions)
      }
    },
    { immediate: true, flush: 'post', deep: true },
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    isSupported,
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
