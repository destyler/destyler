import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackInteractOutside } from '../index'

let frames: Map<number, FrameRequestCallback>
let cleanups: VoidFunction[]
beforeEach(() => {
  frames = new Map()
  cleanups = []
  let nextId = 0
  vi.useFakeTimers()
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)))
})

afterEach(() => {
  cleanups.forEach(cleanup => cleanup())
  document.body.replaceChildren()
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function flushFrame() {
  const callbacks = Array.from(frames.values())
  frames.clear()
  callbacks.forEach(callback => callback(0))
}

function setup(defer = true) {
  const inside = document.createElement('button')
  inside.textContent = 'inside'
  const outside = document.createElement('button')
  outside.textContent = 'outside'
  document.body.append(inside, outside)
  const callback = vi.fn()
  const cleanup = trackInteractOutside(inside, { defer, onInteractOutside: callback })
  cleanups.push(cleanup)
  return { outside, callback, cleanup }
}

function fireOutside(target: HTMLElement, type: 'focus' | 'pointer') {
  const event = type === 'focus'
    ? new FocusEvent('focusin', { bubbles: true })
    : new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', clientX: 0, clientY: 0 })
  target.dispatchEvent(event)
}

describe('deferred outside interaction cleanup', () => {
  it('preserves immediate delivery when defer is disabled', () => {
    const { outside, callback, cleanup } = setup(false)
    vi.runOnlyPendingTimers()
    fireOutside(outside, 'focus')
    expect(callback).toHaveBeenCalledTimes(1)
    fireOutside(outside, 'pointer')
    expect(callback).toHaveBeenCalledTimes(2)
    expect(frames.size).toBe(0)
    cleanup()
    fireOutside(outside, 'focus')
    fireOutside(outside, 'pointer')
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it.each(['focus', 'pointer'] as const)('cancels a queued %s callback on teardown', (type) => {
    const { outside, callback, cleanup } = setup()
    flushFrame()
    vi.runOnlyPendingTimers()
    fireOutside(outside, type)
    expect(frames.size).toBe(1)
    expect(callback).not.toHaveBeenCalled()
    cleanup()
    const pendingAfterCleanup = frames.size
    flushFrame()
    expect(callback).not.toHaveBeenCalled()
    expect(pendingAfterCleanup).toBe(0)
  })

  it.each(['focus', 'pointer'] as const)('delivers active %s events once and retires completed frames', (type) => {
    const { outside, callback, cleanup } = setup()
    flushFrame()
    vi.runOnlyPendingTimers()
    for (let index = 0; index < 3; index++) {
      fireOutside(outside, type)
      expect(callback).toHaveBeenCalledTimes(index)
      flushFrame()
      expect(callback).toHaveBeenCalledTimes(index + 1)
      expect(frames.size).toBe(0)
    }
    vi.mocked(cancelAnimationFrame).mockClear()
    cleanup()
    // Only the outer setup frame's existing cleanup remains. Completed event
    // frames must not accumulate retained cancellation closures until unmount.
    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1)
    fireOutside(outside, type)
    flushFrame()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('cancels deferred installation before any event listener is acquired', () => {
    const { outside, callback, cleanup } = setup()
    cleanup()
    expect(frames.size).toBe(0)
    flushFrame()
    vi.runOnlyPendingTimers()
    fireOutside(outside, 'focus')
    fireOutside(outside, 'pointer')
    flushFrame()
    expect(callback).not.toHaveBeenCalled()
  })
})
