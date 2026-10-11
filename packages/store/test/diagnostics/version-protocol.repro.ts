import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getVersion, proxy, snapshot, subscribe } from '../../src/proxy'

beforeEach(() => {
  vi.stubGlobal('__destyler__proxyStateMap', new WeakMap())
  vi.stubGlobal('__destyler__refSet', new WeakSet())
})

afterEach(() => vi.unstubAllGlobals())

async function loadCopies() {
  vi.resetModules()
  const first = await import('../../src/proxy')
  vi.resetModules()
  const second = await import('../../src/proxy')
  expect(first.proxy).not.toBe(second.proxy)
  return { first, second }
}

describe('unresolved version protocol findings (expected to fail)', () => {
  it('keeps versions monotonic when an alias propagates an older mutation after a nested write', () => {
    const child = { value: 0 }
    const state = proxy({ first: child, second: child, other: 0 })
    const versions: number[] = []
    let nested = false
    const remove = subscribe(state, () => {
      versions.push(getVersion(state)!)
      if (!nested) {
        nested = true
        state.other = 1
      }
    }, true)

    state.first.value = 1
    expect(versions).toHaveLength(2)
    expect(versions[1]).toBeGreaterThan(versions[0])
    expect(getVersion(state)).toBe(versions[1])
    expect(snapshot(state)).toMatchObject({ first: { value: 1 }, second: { value: 1 }, other: 1 })
    remove()
  })

  it('invalidates unobserved parent snapshots for foreign child changes', async () => {
    const { first, second } = await loadCopies()
    const state = first.proxy<{ child?: { value: number }, unrelated: number }>({ unrelated: 0 })
    for (let i = 0; i < 20; i++)
      state.unrelated++
    const child = second.proxy({ value: 0 })
    state.child = child
    const before = first.snapshot(state)

    child.value = 1
    expect(first.snapshot(state).child?.value).toBe(1)
    expect(before.child?.value).toBe(0)
    expect(first.getVersion(state)).toBe(second.getVersion(child))
  })

  it('keeps versions increasing when both copies update the same graph', async () => {
    const { first, second } = await loadCopies()
    const child = second.proxy({ value: 0 })
    const state = first.proxy({ child, value: 0 })
    const versions: number[] = []
    const unsubscribe = second.subscribe(state, () => versions.push(first.getVersion(state)!), true)

    for (let i = 1; i <= 5; i++) {
      state.value = i
      child.value = i
    }
    expect(versions).toHaveLength(10)
    expect(versions.every((version, index) => index === 0 || version > versions[index - 1])).toBe(true)
    expect(first.snapshot(state)).toMatchObject({ value: 5, child: { value: 5 } })
    unsubscribe()
  })

  it('starts fresh subscriptions across copies without replaying old changes', async () => {
    const { first, second } = await loadCopies()
    const child = second.proxy({ value: 0 })
    const state = first.proxy({ child, unrelated: 0 })
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
