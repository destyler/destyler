import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FocusTrap } from '../src/focus-trap'

let container: HTMLDivElement
const traps: FocusTrap[] = []

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  container.tabIndex = -1
  document.body.append(container)
})

afterEach(() => {
  traps.splice(0).reverse().forEach(trap => trap.deactivate({ returnFocus: false }))
  vi.runAllTimers()
  container.remove()
  vi.useRealTimers()
})

const options = () => ({ fallbackFocus: container, initialFocus: false as const, trapStack: [] })

describe('activation bookkeeping does not reserve subclass property names', () => {
  it('preserves a public activationId and suppresses obsolete readiness', async () => {
    class ConsumerTrap extends FocusTrap {
      activationId = 'consumer-owned'
    }
    const trap = new ConsumerTrap(container, options())
    traps.push(trap)
    const oldGate = deferred()
    const newGate = deferred()
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    trap.activate({ checkCanFocusTrap: () => oldGate.promise, onPostActivate: oldPostActivate })
    trap.deactivate({ returnFocus: false })
    trap.activate({ checkCanFocusTrap: () => newGate.promise, onPostActivate: newPostActivate })
    oldGate.resolve()
    await Promise.resolve()
    expect(oldPostActivate).not.toHaveBeenCalled()
    expect(newPostActivate).not.toHaveBeenCalled()
    newGate.resolve()
    await Promise.resolve()
    expect(newPostActivate).toHaveBeenCalledTimes(1)
    expect(trap.activationId).toBe('consumer-owned')
  })

  it('does not write an inherited activationId accessor during construction or activation', async () => {
    const get = vi.fn(() => 'consumer accessor')
    const set = vi.fn(() => {
      throw new Error('consumer property must not be written')
    })
    class ConsumerTrap extends FocusTrap {}
    Object.defineProperty(ConsumerTrap.prototype, 'activationId', { get, set })
    const trap = new ConsumerTrap(container, options())
    traps.push(trap)
    const gate = deferred()
    const onPostActivate = vi.fn()
    trap.activate({ checkCanFocusTrap: () => gate.promise, onPostActivate })
    gate.resolve()
    await Promise.resolve()
    expect(onPostActivate).toHaveBeenCalledTimes(1)
    expect(get).not.toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
  })

  it('keeps generation checks working through a transparent Proxy', async () => {
    const trap = new Proxy(new FocusTrap(container, options()), {})
    traps.push(trap)
    const oldGate = deferred()
    const newGate = deferred()
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    expect(trap.activate({ checkCanFocusTrap: () => oldGate.promise, onPostActivate: oldPostActivate })).toBe(trap)
    trap.deactivate({ returnFocus: false })
    trap.activate({ checkCanFocusTrap: () => newGate.promise, onPostActivate: newPostActivate })
    newGate.resolve()
    await Promise.resolve()
    oldGate.resolve()
    await Promise.resolve()
    expect(newPostActivate).toHaveBeenCalledTimes(1)
    expect(oldPostActivate).not.toHaveBeenCalled()
  })
})
