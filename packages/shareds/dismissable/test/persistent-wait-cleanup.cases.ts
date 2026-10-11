import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackDismissableElement } from '../src/dismissable-layer'
import { layerStack } from '../src/layer-stack'
import { disablePointerEventsOutside } from '../src/pointer-event-outside'

let cleanups: VoidFunction[]
let bodyStyle: string
let inert: string | null
beforeEach(() => {
  cleanups = []
  bodyStyle = document.body.style.cssText
  inert = document.body.getAttribute('data-inert')
  document.body.removeAttribute('data-inert')
  vi.useFakeTimers()
})

afterEach(async () => {
  layerStack.layers.length = 0
  layerStack.branches.length = 0
  cleanups.reverse().forEach(cleanup => cleanup())
  await Promise.resolve()
  document.body.replaceChildren()
  document.body.style.cssText = bodyStyle
  if (inert === null)
    document.body.removeAttribute('data-inert')
  else
    document.body.setAttribute('data-inert', inert)
  vi.clearAllTimers()
  vi.useRealTimers()
})

function node() {
  const element = document.createElement('div')
  document.body.append(element)
  return element
}

function setup(getters: Array<() => Element | null>, nested = true) {
  const bottom = node()
  const top = node()
  if (nested)
    layerStack.add({ node: bottom, pointerBlocking: true, dismiss() {} })
  layerStack.add({ node: top, pointerBlocking: true, dismiss() {} })
  const cleanup = disablePointerEventsOutside(top, getters)
  cleanups.push(cleanup)
  return () => {
    layerStack.remove(top)
    cleanup()
  }
}

describe('persistent element wait cleanup', () => {
  it('cancels its pending poll while another blocking layer remains', () => {
    const getter = vi.fn(() => null)
    const stop = setup([getter])
    expect(getter).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(1)
    stop()
    vi.advanceTimersByTime(100)
    expect(getter).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not style a persistent element that appears after its layer stops', () => {
    let persistent: HTMLElement | null = null
    const stop = setup([() => persistent])
    stop()
    persistent = node()
    persistent.style.pointerEvents = 'none'
    vi.advanceTimersByTime(100)
    expect(persistent.style.pointerEvents).toBe('none')
  })

  it('cancels the remaining query after a sibling query has resolved', () => {
    const ready = node()
    let pending: HTMLElement | null = null
    const stop = setup([() => ready, () => pending])
    expect(ready.style.pointerEvents).toBe('auto')
    expect(vi.getTimerCount()).toBe(1)
    stop()
    pending = node()
    pending.style.pointerEvents = 'none'
    vi.advanceTimersByTime(100)
    expect(pending.style.pointerEvents).toBe('none')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels pending polling through the actual nested dismissable consumer', async () => {
    const bottom = node()
    const top = node()
    let persistent: HTMLElement | null = null
    const cleanupBottom = trackDismissableElement(bottom, { pointerBlocking: true, onDismiss() {} })
    const cleanupTop = trackDismissableElement(top, { pointerBlocking: true, persistentElements: [() => persistent], onDismiss() {} })
    cleanups.push(cleanupBottom, cleanupTop)
    await Promise.resolve()
    cleanupTop()
    expect(layerStack.hasPointerBlockingLayer()).toBe(true)
    persistent = node()
    persistent.style.pointerEvents = 'none'
    vi.advanceTimersByTime(100)
    expect(persistent.style.pointerEvents).toBe('none')
    expect(document.body.style.pointerEvents).toBe('none')
  })

  it('already cancels pending polling when the final layer stops', () => {
    const getter = vi.fn(() => null)
    const stop = setup([getter], false)
    stop()
    vi.advanceTimersByTime(100)
    expect(getter).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('still resolves an element while active and restores it on final cleanup', () => {
    let persistent: HTMLElement | null = null
    const stop = setup([() => persistent], false)
    persistent = node()
    persistent.style.pointerEvents = 'none'
    vi.advanceTimersByTime(100)
    expect(persistent.style.pointerEvents).toBe('auto')
    expect(vi.getTimerCount()).toBe(0)
    stop()
    expect(persistent.style.pointerEvents).toBe('none')
  })
})
