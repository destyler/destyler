import { describe, expect, it, vi } from 'vitest'
import { proxy, snapshot, subscribe } from '../src/proxy'

describe('subscription lifetime during dispatch', () => {
  it('notifies subscribers registered before dispatch', () => {
    const state = proxy({ value: 0 })
    const first = vi.fn()
    const second = vi.fn()
    const removeFirst = subscribe(state, first, true)
    const removeSecond = subscribe(state, second, true)

    state.value = 1
    expect(first).toHaveBeenCalledWith([['set', ['value'], 1, 0]])
    expect(second).toHaveBeenCalledWith([['set', ['value'], 1, 0]])
    removeFirst()
    removeSecond()
  })

  it.each([true, false])('does not deliver an ongoing mutation to a new subscriber (sync: %s)', async (sync) => {
    const state = proxy({ value: 0 })
    const added = vi.fn()
    let removeAdded = () => {}
    const removeFirst = subscribe(state, () => {
      removeAdded = subscribe(state, added, sync)
    }, true)

    state.value = 1
    await Promise.resolve()
    expect(added).not.toHaveBeenCalled()
    removeFirst()

    state.value = 2
    await Promise.resolve()
    expect(added).toHaveBeenCalledExactlyOnceWith([['set', ['value'], 2, 1]])
    removeAdded()
  })

  it('skips a subscriber removed before its turn in the same dispatch', () => {
    const state = proxy({ value: 0 })
    const removed = vi.fn()
    let removeSecond = () => {}
    const removeFirst = subscribe(state, () => removeSecond(), true)
    removeSecond = subscribe(state, removed, true)

    state.value = 1
    expect(removed).not.toHaveBeenCalled()
    removeFirst()
  })

  it('treats re-subscribing the same callback as a new subscription', () => {
    const state = proxy({ value: 0 })
    const callback = vi.fn()
    let removeSecond = () => {}
    const removeFirst = subscribe(state, () => {
      removeSecond()
      removeSecond = subscribe(state, callback, true)
    }, true)
    removeSecond = subscribe(state, callback, true)

    state.value = 1
    expect(callback).not.toHaveBeenCalled()
    removeFirst()

    state.value = 2
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['value'], 2, 1]])
    removeSecond()
  })

  it('takes an independent subscriber snapshot for a nested mutation', () => {
    const state = proxy({ value: 0 })
    const added = vi.fn()
    const firstValues: unknown[] = []
    let removeAdded = () => {}
    const removeFirst = subscribe(state, (ops) => {
      firstValues.push(ops[0][2])
      if (state.value === 1) {
        removeAdded = subscribe(state, added, true)
        state.value = 2
      }
    }, true)

    state.value = 1
    expect(firstValues).toEqual([1, 2])
    expect(added).toHaveBeenCalledExactlyOnceWith([['set', ['value'], 2, 1]])
    expect(snapshot(state).value).toBe(2)
    removeFirst()
    removeAdded()
  })

  it('notifies new subscribers only for future nested-property changes after re-subscription', () => {
    const state = proxy({ nested: { count: 0 } })
    const added = vi.fn()
    let removeAdded = () => {}
    let removeFirst = () => {}
    removeFirst = subscribe(state, () => {
      removeFirst()
      removeAdded = subscribe(state, added, true)
    }, true)

    state.nested.count = 1
    expect(added).not.toHaveBeenCalled()
    state.nested.count = 2
    expect(added).toHaveBeenCalledExactlyOnceWith([['set', ['nested', 'count'], 2, 1]])
    removeAdded()
  })
})
