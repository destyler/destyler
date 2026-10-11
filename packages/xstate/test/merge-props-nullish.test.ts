import { mergeProps } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'

describe('mergeProps nullish event callbacks', () => {
  it.each([undefined, null])('skips a callback captured as %s after its callable check', (later) => {
    let reads = 0
    const calls: unknown[] = []
    const owner = Object.freeze({ id: 'receiver' })
    const payload = Object.freeze({ id: 'payload' })
    const consumer = vi.fn()
    const incoming = Object.freeze({
      get onRequest(): ((...args: unknown[]) => void) | null | undefined {
        reads++
        return reads === 1 ? consumer : later
      },
    })
    const descriptor = Object.getOwnPropertyDescriptor(incoming, 'onRequest')
    const merged = mergeProps({
      onRequest(this: unknown, ...args: unknown[]) {
        calls.push(['internal', this, ...args])
      },
    }, incoming, {
      onRequest(this: unknown, ...args: unknown[]) {
        calls.push(['last', this, ...args])
      },
    })

    expect(reads).toBe(2)
    for (let i = 0; i < 2; i++)
      expect(merged.onRequest!.call(owner, payload, 0, false, null)).toBeUndefined()

    expect(calls).toEqual([
      ['last', owner, payload, 0, false, null],
      ['internal', owner, payload, 0, false, null],
      ['last', owner, payload, 0, false, null],
      ['internal', owner, payload, 0, false, null],
    ])
    expect(consumer).not.toHaveBeenCalled()
    expect(reads).toBe(2)
    expect(Object.getOwnPropertyDescriptor(incoming, 'onRequest')).toEqual(descriptor)
  })

  it.each([false, 0, '', 'metadata', {}])('still rejects a callback captured as non-callable %j', (later) => {
    let reads = 0
    const internal = vi.fn()
    const consumer = vi.fn()
    const incoming = Object.freeze({
      get onRequest() {
        reads++
        return reads === 1 ? consumer : later
      },
    })
    const merged = mergeProps({ onRequest: internal }, incoming)

    expect(reads).toBe(2)
    expect(() => Reflect.apply(merged.onRequest as () => void, {}, [])).toThrow(TypeError)
    expect(internal).not.toHaveBeenCalled()
    expect(consumer).not.toHaveBeenCalled()
    expect(reads).toBe(2)
  })

  it.each([undefined, null])('preserves the exact next exception after skipping %s', (later) => {
    let reads = 0
    const expected = Object.freeze({ reason: 'handler failure' })
    const internal = vi.fn()
    const merged = mergeProps({ onRequest: internal }, {
      onRequest() {
        throw expected
      },
    }, Object.freeze({
      get onRequest(): ((...args: unknown[]) => void) | null | undefined {
        reads++
        return reads === 1 ? vi.fn() : later
      },
    }))
    let caught: unknown
    try {
      merged.onRequest!()
    }
    catch (error) {
      caught = error
    }

    expect(caught).toBe(expected)
    expect(internal).not.toHaveBeenCalled()
    expect(reads).toBe(2)
  })
})
