import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.stubGlobal('__destyler__proxyStateMap', new WeakMap())
  vi.stubGlobal('__destyler__refSet', new WeakSet())
})

afterEach(() => vi.unstubAllGlobals())

async function loadCopies() {
  vi.resetModules()
  const first = await import('../src/proxy')
  vi.resetModules()
  const second = await import('../src/proxy')
  expect(first.proxy).not.toBe(second.proxy)
  return { first, second }
}

describe('store copies sharing proxy state', () => {
  it.each([true, false])('observes a child from another loaded copy after parent-side writes (sync: %s)', async (sync) => {
    const { first, second } = await loadCopies()
    const state = first.proxy<{ child?: { value: number }, unrelated: number }>({ unrelated: 0 })
    for (let i = 0; i < 20; i++)
      state.unrelated++
    const child = second.proxy({ value: 0 })
    state.child = child
    const callback = vi.fn()
    const unsubscribe = first.subscribe(state, callback, sync)
    const before = first.snapshot(state)

    child.value = 1
    await Promise.resolve()
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 1, 0]])
    expect(first.snapshot(state).child?.value).toBe(1)
    expect(before.child?.value).toBe(0)
    expect(second.snapshot(state)).toBe(first.snapshot(state))
    unsubscribe()
  })

  it('keeps cyclic cross-copy graphs and nested writes finite and current', async () => {
    const { first, second } = await loadCopies()
    interface State { value: number, other?: State }
    const parent = first.proxy<State>({ value: 0 })
    const child = second.proxy<State>({ value: 0 })
    parent.other = child
    child.other = parent
    const callback = vi.fn()
    const unsubscribe = first.subscribe(parent, callback, true)

    child.value = 1
    expect(callback).toHaveBeenCalledTimes(1)
    const state = first.snapshot(parent)
    expect(state.other?.value).toBe(1)
    expect(state.other?.other).toBe(state)
    unsubscribe()
  })

  it('starts fresh subscriptions across copies without replaying old changes', async () => {
    const { first, second } = await loadCopies()
    const child = second.proxy({ value: 0 })
    const state = first.proxy({ child, unrelated: 0 })
    // Keep the clocks distinct so this lifetime control does not depend on
    // resolving the separately documented legacy clock-collision defect.
    for (let i = 0; i < 20; i++)
      state.unrelated++
    const oldListener = vi.fn()
    const oldUnsubscribe = first.subscribe(state, oldListener, true)
    child.value = 1
    oldUnsubscribe()
    for (let i = 0; i < 20; i++)
      state.unrelated++
    const newListener = vi.fn()
    const newUnsubscribe = second.subscribe(state, newListener, true)

    child.value = 2
    expect(newListener).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 2, 1]])
    expect(oldListener).toHaveBeenCalledTimes(1)
    newUnsubscribe()
  })
})
