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
  const rect = target.getBoundingClientRect()
  const event = type === 'focus'
    ? new FocusEvent('focusin', { bubbles: true })
    : new PointerEvent('pointerdown', {
        bubbles: true,
        pointerType: 'mouse',
        // CSS resets can place the protected node at (0, 0). Use the actual
        // outside target's center so the browser exercises an outside gesture.
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
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

describe.each([false, true])('outside cleanup retries with defer=%s', (defer) => {
  it('does not reenter listener removal while cleanup is in progress', () => {
    const { cleanup } = setup(defer)
    if (defer)
      flushFrame()
    vi.runOnlyPendingTimers()

    const originalRemove = document.removeEventListener.bind(document)
    let removals = 0
    const remove = vi.spyOn(document, 'removeEventListener').mockImplementation((event, listener, options) => {
      if (event === 'focusin' || event === 'pointerdown') {
        removals++
        cleanup()
      }
      originalRemove(event, listener, options)
    })
    try {
      expect(cleanup).not.toThrow()
      expect(removals).toBe(2)
      cleanup()
      expect(removals).toBe(2)
    }
    finally {
      remove.mockRestore()
      cleanup()
    }
  })

  it('retires successful removals and preserves the exact error for a later failure', () => {
    const { cleanup } = setup(defer)
    if (defer)
      flushFrame()
    vi.runOnlyPendingTimers()

    const originalRemove = document.removeEventListener.bind(document)
    const failure = new Error('retry only the remaining listener')
    const removals: string[] = []
    let pointerAttempts = 0
    const remove = vi.spyOn(document, 'removeEventListener').mockImplementation((event, listener, options) => {
      removals.push(event)
      if (event === 'pointerdown' && ++pointerAttempts === 1)
        throw failure
      originalRemove(event, listener, options)
    })
    try {
      let thrown: unknown
      try {
        cleanup()
      }
      catch (error) {
        thrown = error
      }
      expect(thrown).toBe(failure)
      expect(removals).toEqual(['focusin', 'pointerdown'])
      cleanup()
      expect(removals).toEqual(['focusin', 'pointerdown', 'pointerdown'])
      cleanup()
      expect(removals).toEqual(['focusin', 'pointerdown', 'pointerdown'])
    }
    finally {
      remove.mockRestore()
      cleanup()
    }
  })

  it.each(['focusin', 'pointerdown', 'click'] as const)('retries a failed %s listener removal', (type) => {
    const { outside, callback, cleanup } = setup(defer)
    if (defer)
      flushFrame()
    vi.runOnlyPendingTimers()
    if (type === 'click') {
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
    }

    const originalRemove = document.removeEventListener.bind(document)
    const error = new Error('temporary listener removal failure')
    let attempts = 0
    const remove = vi.spyOn(document, 'removeEventListener').mockImplementation((event, listener, options) => {
      if (event === type && ++attempts === 1)
        throw error
      originalRemove(event, listener, options)
    })

    try {
      expect(cleanup).toThrow(error)
      fireOutside(outside, 'focus')
      fireOutside(outside, 'pointer')
      flushFrame()
      expect(callback).not.toHaveBeenCalled()

      expect(cleanup).not.toThrow()
      expect(attempts).toBe(2)
      cleanup()
      expect(attempts).toBe(2)
      fireOutside(outside, 'focus')
      fireOutside(outside, 'pointer')
      flushFrame()
      expect(callback).not.toHaveBeenCalled()
    }
    finally {
      remove.mockRestore()
      cleanup()
    }
  })
})
