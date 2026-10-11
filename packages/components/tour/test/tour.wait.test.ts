// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { waitForElement, waitForElementValue } from '../index'

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.replaceChildren()
})

describe('tour public wait helper resource ownership', () => {
  it.each(['abort', 'timeout'] as const)('disconnects the element observer after %s', async (mode) => {
    vi.useFakeTimers()
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    const [promise, abort] = waitForElement(() => null as any, { timeout: 10 })
    const rejected = expect(promise).rejects.toThrow(mode === 'abort' ? 'Promise aborted' : 'Timeout of 10ms exceeded')
    if (mode === 'abort')
      abort()
    else await vi.advanceTimersByTimeAsync(10)
    await rejected
    expect(disconnect).toHaveBeenCalledTimes(1)
    abort()
    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('observes the explicitly provided shadow root', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const rootNode = host.attachShadow({ mode: 'open' })
    const [promise] = waitForElement(() => rootNode.querySelector('button') as HTMLElement, { timeout: 100, rootNode })
    const target = document.createElement('button')
    rootNode.append(target)
    await expect(promise).resolves.toBe(target)
  })

  it('does not retain an input listener when the requested value already exists', async () => {
    const input = document.createElement('input')
    input.value = 'ready'
    const add = vi.spyOn(input, 'addEventListener')
    const [promise] = waitForElementValue(() => input, 'ready', { timeout: 100 })
    await promise
    expect(add.mock.calls.filter(([type]) => type === 'input')).toHaveLength(0)
  })

  it.each(['abort', 'timeout', 'resolve'] as const)('removes the exact value listener after %s', async (mode) => {
    vi.useFakeTimers()
    const input = document.createElement('input')
    const add = vi.spyOn(input, 'addEventListener')
    const remove = vi.spyOn(input, 'removeEventListener')
    const [promise, abort] = waitForElementValue(() => input, 'ready', { timeout: 10 })
    const settled = mode === 'resolve' ? expect(promise).resolves.toBeUndefined() : expect(promise).rejects.toThrow()
    const listener = add.mock.calls.find(([type]) => type === 'input')?.[1]
    expect(listener).toBeTypeOf('function')
    if (mode === 'abort') {
      abort()
    }
    else if (mode === 'timeout') {
      await vi.advanceTimersByTimeAsync(10)
    }
    else {
      input.value = 'ready'
      input.dispatchEvent(new Event('input'))
    }
    await settled
    expect(remove).toHaveBeenCalledWith('input', listener)
  })

  it('resolves an existing target without observing or leaking timers', async () => {
    vi.useFakeTimers()
    const target = document.createElement('button')
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const [promise, abort] = waitForElement(() => target, { timeout: 10 })
    await expect(promise).resolves.toBe(target)
    expect(observe).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    abort()
    await expect(promise).resolves.toBe(target)
  })
})
