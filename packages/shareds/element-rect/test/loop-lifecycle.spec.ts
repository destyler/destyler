import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackElementRect } from '../src/rect'

const cleanups: VoidFunction[] = []
let frames: Map<number, FrameRequestCallback>
let nextId: number

beforeEach(() => {
  frames = new Map()
  nextId = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id)
  })
})

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.unstubAllGlobals()
})

function tick() {
  for (const [id, callback] of [...frames]) {
    if (frames.delete(id))
      callback(0)
  }
}

function element() {
  const node = document.createElement('div')
  const getRect = vi.fn(() => ({ top: 0, left: 0, width: 10, height: 20 }))
  return { node, getRect }
}

function observe(node: HTMLElement, onChange: () => void, getRect: ReturnType<typeof element>['getRect']) {
  const stop = trackElementRect(node, { onChange, getRect })
  cleanups.push(stop)
  return stop
}

describe('element rectangle frame ownership', () => {
  it('does not restart the loop after the last callback removes itself', () => {
    const { node, getRect } = element()
    let stop: VoidFunction
    const onChange = vi.fn(() => stop())
    stop = observe(node, onChange, getRect)
    tick()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(0)
    tick()
    expect(getRect).toHaveBeenCalledTimes(1)
  })

  it.each([false, true])('keeps one loop when a callback replaces the last observer (same element=%s)', (sameElement) => {
    const { node, getRect } = element()
    const replacement = sameElement ? node : document.createElement('div')
    const onReplacement = vi.fn()
    let stopReplacement: VoidFunction | undefined
    const stop = observe(node, () => {
      stop()
      stopReplacement = observe(replacement, onReplacement, getRect)
    }, getRect)
    tick()
    expect(frames.size).toBe(1)
    expect(onReplacement).not.toHaveBeenCalled()
    tick()
    expect(onReplacement).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(1)
    stopReplacement!()
    expect(frames.size).toBe(0)
  })

  it('stops when a callback removes all pending elements', () => {
    const first = element()
    const second = element()
    const onSecond = vi.fn()
    let stopSecond: VoidFunction
    const stopFirst = observe(first.node, () => {
      stopFirst()
      stopSecond()
    }, first.getRect)
    stopSecond = observe(second.node, onSecond, first.getRect)
    tick()
    expect(onSecond).not.toHaveBeenCalled()
    expect(frames.size).toBe(0)
  })

  it('keeps a single loop for a surviving observed element', () => {
    const first = element()
    const second = element()
    const onSecond = vi.fn()
    const stopFirst = observe(first.node, () => stopFirst(), first.getRect)
    const stopSecond = observe(second.node, onSecond, first.getRect)
    tick()
    expect(onSecond).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(1)
    tick()
    expect(onSecond).toHaveBeenCalledTimes(1)
    stopSecond()
    expect(frames.size).toBe(0)
  })

  it('cancels an ordinary pending frame before its first delivery', () => {
    const { node, getRect } = element()
    const onChange = vi.fn()
    const stop = observe(node, onChange, getRect)
    expect(frames.size).toBe(1)
    stop()
    stop()
    expect(frames.size).toBe(0)
    tick()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('starts a new ordinary lifetime after all observers stopped', () => {
    const { node, getRect } = element()
    const first = vi.fn()
    const stop = observe(node, first, getRect)
    tick()
    stop()
    const second = vi.fn()
    const stopSecond = observe(node, second, getRect)
    expect(second).not.toHaveBeenCalled()
    expect(frames.size).toBe(1)
    tick()
    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
    stopSecond()
    expect(frames.size).toBe(0)
  })

  it('does not swallow callback exceptions or block a fresh lifetime after cleanup', () => {
    const { node, getRect } = element()
    const error = new Error('consumer callback')
    const stop = observe(node, () => {
      stop()
      throw error
    }, getRect)
    expect(tick).toThrow(error)
    expect(frames.size).toBe(0)
    const onChange = vi.fn()
    const nextStop = observe(node, onChange, getRect)
    tick()
    expect(onChange).toHaveBeenCalledTimes(1)
    nextStop()
    expect(frames.size).toBe(0)
  })
})
