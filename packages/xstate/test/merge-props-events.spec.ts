import { afterEach, describe, expect, it, vi } from 'vitest'
import { mergeProps } from '../src/merge-props'

const cleanups: (() => void)[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))

describe('mergeProps event receiver', () => {
  it.each([1, 2, 3])('keeps the native receiver with %s event handlers', (count) => {
    const button = document.createElement('button')
    const calls: { id: number, owner: unknown, event: MouseEvent }[] = []
    const sources = Array.from({ length: count }, (_, id) => ({
      onClick(this: unknown, event: MouseEvent) { calls.push({ id, owner: this, event }) },
    }))
    const { onClick } = mergeProps(...sources)
    button.addEventListener('click', onClick)
    cleanups.push(() => button.removeEventListener('click', onClick))
    const event = new MouseEvent('click')
    button.dispatchEvent(event)

    expect(calls.map(call => call.id)).toEqual(Array.from({ length: count }, (_, index) => count - index - 1))
    for (const call of calls) {
      expect(call.owner).toBe(button)
      expect(call.event).toBe(event)
    }
    button.removeEventListener('click', onClick)
    button.dispatchEvent(new MouseEvent('click'))
    expect(calls).toHaveLength(count)
  })

  it('preserves all arguments, frozen source handlers and a bound receiver', () => {
    const owner = { id: 'dynamic' }
    const bound = { id: 'bound' }
    const payload = Object.freeze({ value: 1 })
    const calls: unknown[] = []
    const first = Object.freeze(function (this: unknown, ...args: unknown[]) {
      calls.push([this, ...args])
    })
    const second = Object.freeze(function (this: unknown, ...args: unknown[]) {
      calls.push([this, ...args])
    }.bind(bound))
    const initial = Object.freeze({ onRequest: first })
    const next = Object.freeze({ onRequest: second })
    const initialDescriptor = Object.getOwnPropertyDescriptor(initial, 'onRequest')
    const merged = mergeProps(initial, next)
    merged.onRequest.call(owner, payload, 0, false, null)

    expect(calls).toEqual([[bound, payload, 0, false, null], [owner, payload, 0, false, null]])
    expect(Object.getOwnPropertyDescriptor(initial, 'onRequest')).toEqual(initialDescriptor)
    expect(next.onRequest).toBe(second)
  })

  it.each(['own apply property', 'null prototype'])('invokes frozen callable handlers with %s directly', (shape) => {
    const calls: string[] = []
    const handler = function () {
      calls.push('consumer')
    }
    if (shape === 'own apply property')
      Object.defineProperty(handler, 'apply', { value: 'metadata', enumerable: true })
    else
      Object.setPrototypeOf(handler, null)
    Object.freeze(handler)
    const merged = mergeProps({ onClick: () => calls.push('internal') }, { onClick: handler })

    merged.onClick()
    expect(calls).toEqual(['consumer', 'internal'])
    expect(Object.isFrozen(handler)).toBe(true)
  })

  it('passes defaultPrevented through without imposing a new cancellation policy', () => {
    const calls: string[] = []
    const event = new Event('request', { cancelable: true })
    const merged = mergeProps({
      onRequest(value: Event) {
        expect(value).toBe(event)
        expect(value.defaultPrevented).toBe(true)
        calls.push('internal')
      },
    }, {
      onRequest(value: Event) {
        value.preventDefault()
        calls.push('consumer')
      },
    })
    merged.onRequest(event)

    expect(calls).toEqual(['consumer', 'internal'])
  })

  it('retains thrown-handler propagation and does not call later handlers', () => {
    const expected = new Error('consumer failure')
    const internal = vi.fn()
    const merged = mergeProps({ onClick: internal }, {
      onClick: () => {
        throw expected
      },
    })

    expect(() => merged.onClick()).toThrow(expected)
    expect(internal).not.toHaveBeenCalled()
  })

  it('leaves non-event callbacks as last-source values', () => {
    const initial = vi.fn()
    const next = vi.fn()
    const merged = mergeProps({ render: initial }, { render: next })

    expect(merged.render).toBe(next)
    expect(initial).not.toHaveBeenCalled()
  })
})
