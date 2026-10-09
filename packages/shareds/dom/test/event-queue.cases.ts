import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { queueBeforeEvent } from '../src/raf'

let frames: Map<number, FrameRequestCallback>
let cleanups: VoidFunction[]

beforeEach(() => {
  frames = new Map()
  cleanups = []
  let nextId = 0
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)))
})

afterEach(() => {
  cleanups.forEach(cleanup => cleanup())
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function flushFrame() {
  const callbacks = Array.from(frames.values())
  frames.clear()
  callbacks.forEach(callback => callback(0))
}

function queue(target: HTMLElement, callback: VoidFunction) {
  const cleanup = queueBeforeEvent(target, 'keyup', callback)
  cleanups.push(cleanup)
  return cleanup
}

describe('queueBeforeEvent lifecycle', () => {
  it('cancels both the frame and the exact capture listener before either fires', () => {
    const target = document.createElement('button')
    const add = vi.spyOn(target, 'addEventListener')
    const remove = vi.spyOn(target, 'removeEventListener')
    const callback = vi.fn()
    const cleanup = queue(target, callback)
    const handler = add.mock.calls[0][1]

    cleanup()
    expect(remove).toHaveBeenCalledWith('keyup', handler, true)
    expect(frames.size).toBe(0)
    target.dispatchEvent(new Event('keyup'))
    flushFrame()
    expect(callback).not.toHaveBeenCalled()
  })

  it('does not let a cancelled queue fire alongside a later queue or remove unrelated listeners', () => {
    const target = document.createElement('button')
    const external = vi.fn()
    target.addEventListener('keyup', external, true)
    const oldCallback = vi.fn()
    const nextCallback = vi.fn()
    const cleanup = queue(target, oldCallback)
    cleanup()
    cleanup()
    queue(target, nextCallback)

    target.dispatchEvent(new Event('keyup'))
    flushFrame()
    expect(oldCallback).not.toHaveBeenCalled()
    expect(nextCallback).toHaveBeenCalledTimes(1)
    expect(external).toHaveBeenCalledTimes(1)
    target.removeEventListener('keyup', external, true)
  })

  it('runs once when the event wins and cancels the pending frame', () => {
    const target = document.createElement('button')
    const callback = vi.fn()
    const cleanup = queue(target, callback)

    target.dispatchEvent(new Event('keyup'))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(0)
    target.dispatchEvent(new Event('keyup'))
    flushFrame()
    cleanup()
    cleanup()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('runs once when the frame wins and removes the pending event listener', () => {
    const target = document.createElement('button')
    const callback = vi.fn()
    const cleanup = queue(target, callback)

    flushFrame()
    expect(callback).toHaveBeenCalledTimes(1)
    target.dispatchEvent(new Event('keyup'))
    flushFrame()
    cleanup()
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
