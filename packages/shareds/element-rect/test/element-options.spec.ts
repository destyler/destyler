import type { ElementRectOptions } from '../src/rect'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackElementRect } from '../src/rect'

const cleanups: VoidFunction[] = []
let frames: Map<number, FrameRequestCallback>
let nextId: number
const rect = (width: number, left = 0) => ({ width, left, top: 0, height: 10 })

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

function observe(element: HTMLElement, options: ElementRectOptions) {
  const stop = trackElementRect(element, options)
  cleanups.push(stop)
  return stop
}

describe('independent observed-element options', () => {
  it.each([false, true])('uses each element\'s own getter regardless of registration order (reverse=%s)', (reverse) => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const aGetter = vi.fn((element: HTMLElement) => {
      expect(element).toBe(a)
      return rect(10)
    })
    const bGetter = vi.fn((element: HTMLElement) => {
      expect(element).toBe(b)
      return rect(20)
    })
    const aChange = vi.fn()
    const bChange = vi.fn()
    const registrations = [() => observe(a, { getRect: aGetter, onChange: aChange }), () => observe(b, { getRect: bGetter, onChange: bChange })]
    if (reverse)
      registrations.reverse()
    registrations.forEach(register => register())
    tick()
    expect(aGetter).toHaveBeenCalledTimes(1)
    expect(bGetter).toHaveBeenCalledTimes(1)
    expect(aChange).toHaveBeenCalledExactlyOnceWith(rect(10))
    expect(bChange).toHaveBeenCalledExactlyOnceWith(rect(20))
    expect(frames.size).toBe(1)
  })

  it.each(['size', 'position'] as const)('does not let the first %s observer suppress another element\'s different scope', (firstScope) => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    let current = rect(10)
    const getRect = () => current
    const aChange = vi.fn()
    const bChange = vi.fn()
    observe(a, { scope: firstScope, getRect, onChange: aChange })
    observe(b, { scope: firstScope === 'size' ? 'position' : 'size', getRect, onChange: bChange })
    tick()
    aChange.mockClear()
    bChange.mockClear()
    current = firstScope === 'size' ? rect(10, 5) : rect(20)
    tick()
    expect(aChange).not.toHaveBeenCalled()
    expect(bChange).toHaveBeenCalledExactlyOnceWith(current)
  })

  it('continues using the surviving element\'s getter when the first observer stops', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const aGetter = vi.fn(() => rect(10))
    let value = rect(20)
    const bGetter = vi.fn(() => value)
    const bChange = vi.fn()
    const stopA = observe(a, { getRect: aGetter, onChange: vi.fn() })
    observe(b, { getRect: bGetter, onChange: bChange })
    tick()
    stopA()
    aGetter.mockClear()
    bChange.mockClear()
    value = rect(30)
    tick()
    expect(aGetter).not.toHaveBeenCalled()
    expect(bChange).toHaveBeenCalledExactlyOnceWith(value)
  })

  it('preserves plain-function and bound-function getter receivers', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const receivers: unknown[] = []
    const plain = function (this: unknown) {
      receivers.push(this)
      return rect(10)
    }
    const owner = { width: 20 }
    const bound = function (this: typeof owner) {
      receivers.push(this)
      return rect(this.width)
    }.bind(owner)
    observe(a, { getRect: plain, onChange: vi.fn() })
    observe(b, { getRect: bound, onChange: vi.fn() })
    tick()
    expect(receivers).toEqual([undefined, owner])
  })

  it('preserves ordinary repeated measurement and change-only notification', () => {
    const element = document.createElement('div')
    let value = rect(10)
    const onChange = vi.fn()
    observe(element, { getRect: () => value, onChange })
    tick()
    tick()
    expect(onChange).toHaveBeenCalledExactlyOnceWith(rect(10))
    value = rect(20, 5)
    tick()
    expect(onChange.mock.calls).toEqual([[rect(10)], [rect(20, 5)]])
  })

  it.each([false, true])('mixes default and custom getters without replacing either (reverse=%s)', (reverse) => {
    const custom = document.createElement('div')
    const native = document.createElement('div')
    vi.spyOn(custom, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 60, 10))
    vi.spyOn(native, 'getBoundingClientRect').mockReturnValue(new DOMRect(5, 0, 20, 10))
    const customChange = vi.fn()
    const nativeChange = vi.fn()
    const registrations = [
      () => observe(custom, { getRect: () => rect(10), onChange: customChange }),
      () => observe(native, { onChange: nativeChange }),
    ]
    if (reverse)
      registrations.reverse()
    registrations.forEach(register => register())
    tick()
    expect(customChange).toHaveBeenCalledExactlyOnceWith(rect(10))
    expect(nativeChange).toHaveBeenCalledTimes(1)
    expect(nativeChange.mock.calls[0][0]).toMatchObject(rect(20, 5))
  })

  it('preserves initial-delivery timing for same-element subscribers with identical options', () => {
    const element = document.createElement('div')
    const getRect = () => rect(10)
    const first = vi.fn()
    const second = vi.fn()
    observe(element, { getRect, onChange: first })
    observe(element, { getRect, onChange: second })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledExactlyOnceWith(rect(10))
    tick()
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
    tick()
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
  })

  it('does not stop another element when a later observer is removed', () => {
    const a = document.createElement('div')
    const b = document.createElement('div')
    const aChange = vi.fn()
    const bChange = vi.fn()
    observe(a, { getRect: () => rect(10), onChange: aChange })
    const stopB = observe(b, { getRect: () => rect(20), onChange: bChange })
    stopB()
    tick()
    expect(aChange).toHaveBeenCalledExactlyOnceWith(rect(10))
    expect(bChange).not.toHaveBeenCalled()
    expect(frames.size).toBe(1)
  })
})
