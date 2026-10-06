import { describe, expect, it, vi } from 'vitest'
import { proxy, snapshot, subscribe } from '../src/proxy'

describe('failed mutations', () => {
  it.each([undefined, true, false])('preserves child ownership installed by a reentrant setter (sync: %s)', async (sync) => {
    const state = proxy({
      get child() {
        return { value: 0 }
      },
      set child(value: { value: number }) {
        Reflect.deleteProperty(this, 'child')
        this.child = value
      },
    })
    state.child = { value: 1 }
    const before = snapshot(state)
    const callback = vi.fn()
    const unsubscribe = sync === undefined ? () => {} : subscribe(state, callback, sync)

    state.child.value = 2
    await Promise.resolve()
    expect(snapshot(state).child.value).toBe(2)
    expect(before.child.value).toBe(1)
    if (sync !== undefined)
      expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 2, 1]])
    unsubscribe()
  })

  it.each(['add', 'remove', 'cycle'] as const)('keeps the committed child when a receiver changes subscriptions (%s)', (change) => {
    const old = proxy({ value: 0 })
    const next = proxy({ value: 10 })
    const state = proxy({ child: old })
    const callback = vi.fn()
    let unsubscribe = change === 'add' ? () => {} : subscribe(state, callback, true)
    const receiver = new Proxy(state, {
      defineProperty(target, prop, descriptor) {
        if (change !== 'add')
          unsubscribe()
        if (change !== 'remove')
          unsubscribe = subscribe(state, callback, true)
        return Reflect.defineProperty(target, prop, descriptor)
      },
    })

    expect(Reflect.set(state, 'child', next, receiver)).toBe(true)
    const before = snapshot(state)
    callback.mockClear()
    old.value = 1
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)

    next.value = 11
    expect(snapshot(state).child.value).toBe(11)
    expect(callback).toHaveBeenCalledTimes(change === 'remove' ? 0 : 1)
    unsubscribe()
  })

  it('tracks the final outer value after a receiver temporarily installs another child', () => {
    const old = proxy({ value: 0 })
    const next = proxy({ value: 10 })
    const intermediate = proxy({ value: 20 })
    const state = proxy({ child: old })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, true)
    const receiver = new Proxy(state, {
      defineProperty(target, prop, descriptor) {
        state.child = intermediate
        return Reflect.defineProperty(target, prop, descriptor)
      },
    })

    expect(Reflect.set(state, 'child', next, receiver)).toBe(true)
    const before = snapshot(state)
    callback.mockClear()
    intermediate.value = 21
    old.value = 1
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)

    next.value = 11
    expect(snapshot(state).child.value).toBe(11)
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 11, 10]])
    unsubscribe()
  })

  it('retains ownership when an accessor deletes and reinstalls the same child', () => {
    const retained = proxy({ value: 0 })
    const state = proxy({ child: retained })
    Object.defineProperty(state, 'child', {
      get: () => retained,
      set: () => {
        Reflect.deleteProperty(state, 'child')
        state.child = retained
      },
      configurable: true,
    })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, true)

    state.child = { value: 10 }
    expect(state.child).toBe(retained)
    const before = snapshot(state)
    callback.mockClear()
    retained.value = 1
    expect(snapshot(state).child.value).toBe(1)
    expect(before.child.value).toBe(0)
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 1, 0]])
    unsubscribe()
  })

  it.each([true, false])('keeps child subscriptions after a rejected deletion (sync: %s)', async (sync) => {
    const state = proxy({ child: { value: 0 } })
    Object.defineProperty(state, 'child', { configurable: false })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, sync)
    const before = snapshot(state)

    expect(Reflect.deleteProperty(state, 'child')).toBe(false)
    await Promise.resolve()
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)

    state.child.value = 1
    await Promise.resolve()
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 1, 0]])
    expect(snapshot(state).child.value).toBe(1)
    expect(before.child.value).toBe(0)
    unsubscribe()
  })

  it('tracks child versions after rejected deletion without subscribers', () => {
    const state = proxy({ child: { value: 0 } })
    Object.defineProperty(state, 'child', { configurable: false })
    const before = snapshot(state)

    expect(Reflect.deleteProperty(state, 'child')).toBe(false)
    state.child.value = 1
    expect(snapshot(state).child.value).toBe(1)
    expect(before.child.value).toBe(0)
  })

  it('reports a rejected addition without subscribing to its rejected value', () => {
    const state = proxy({ count: 0 })
    Object.preventExtensions(state)
    const rejected = proxy({ value: 0 })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, true)
    const before = snapshot(state)

    expect(Reflect.set(state, 'child', rejected)).toBe(false)
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)
    rejected.value = 1
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)
    unsubscribe()
  })

  it.each([true, false])('preserves original child ownership when replacement fails (sync: %s)', async (sync) => {
    const state = proxy({ child: { value: 0 } })
    Object.defineProperty(state, 'child', { configurable: false, writable: false })
    const rejected = proxy({ value: 10 })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, sync)
    const before = snapshot(state)

    expect(() => {
      state.child = rejected
    }).toThrow(TypeError)
    await Promise.resolve()
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toBe(before)
    rejected.value = 11
    await Promise.resolve()
    expect(callback).not.toHaveBeenCalled()

    state.child.value = 1
    await Promise.resolve()
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 1, 0]])
    expect(snapshot(state).child.value).toBe(1)
    expect(before.child.value).toBe(0)
    unsubscribe()
  })

  it('preserves child listeners when a setter throws', () => {
    const state = proxy({ child: { value: 0 } })
    const child = state.child
    Object.defineProperty(state, 'child', {
      get: () => child,
      set: () => { throw new Error('rejected') },
    })
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, true)

    expect(() => {
      state.child = { value: 10 }
    }).toThrow('rejected')
    expect(callback).not.toHaveBeenCalled()
    child.value = 1
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 1, 0]])
    unsubscribe()
  })

  it('still detaches deleted and successfully replaced children', () => {
    const state = proxy<{ child?: { value: number } }>({ child: { value: 0 } })
    const old = state.child!
    const callback = vi.fn()
    const unsubscribe = subscribe(state, callback, true)

    expect(Reflect.set(state, 'child', { value: 1 })).toBe(true)
    callback.mockClear()
    old.value = 10
    expect(callback).not.toHaveBeenCalled()
    const replacement = state.child!
    replacement.value = 2
    expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['child', 'value'], 2, 1]])
    callback.mockClear()

    expect(Reflect.deleteProperty(state, 'child')).toBe(true)
    expect(callback).toHaveBeenCalledTimes(1)
    callback.mockClear()
    replacement.value = 3
    expect(callback).not.toHaveBeenCalled()
    expect(snapshot(state)).toEqual({})
    unsubscribe()
  })
})

it('reports a partially rejected array truncation and detaches only the deleted entries', () => {
  const state = proxy([{ value: 0 }, { value: 1 }, { value: 2 }])
  const removed = state[2]
  const retained = state[1]
  Object.defineProperty(state, '1', { configurable: false })
  const callback = vi.fn()
  const unsubscribe = subscribe(state, callback, true)
  const before = snapshot(state)

  expect(Reflect.set(state, 'length', 0)).toBe(false)
  expect(state).toHaveLength(2)
  expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['length'], 2, 3]])
  expect(snapshot(state)).toHaveLength(2)
  expect(before).toHaveLength(3)
  callback.mockClear()

  removed.value = 3
  expect(callback).not.toHaveBeenCalled()
  retained.value = 10
  expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['1', 'value'], 10, 1]])
  unsubscribe()
})

it('detaches removed array entries after a successful length assignment', () => {
  const state = proxy([{ value: 0 }, { value: 1 }])
  const removed = state[1]
  const callback = vi.fn()
  const unsubscribe = subscribe(state, callback, true)

  state.length = 1
  expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['length'], 1, 2]])
  callback.mockClear()
  removed.value = 2
  expect(callback).not.toHaveBeenCalled()
  state[0].value = 1
  expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['0', 'value'], 1, 0]])
  unsubscribe()
})

it('keeps child subscriptions when an invalid length throws without changing the array', () => {
  const state = proxy([{ value: 0 }])
  const callback = vi.fn()
  const unsubscribe = subscribe(state, callback, true)
  const before = snapshot(state)

  expect(() => {
    state.length = -1
  }).toThrow(RangeError)
  expect(callback).not.toHaveBeenCalled()
  expect(snapshot(state)).toBe(before)
  state[0].value = 1
  expect(callback).toHaveBeenCalledExactlyOnceWith([['set', ['0', 'value'], 1, 0]])
  unsubscribe()
})

it('does not invalidate an unobserved truncated array when a removed child changes', () => {
  const state = proxy([{ value: 0 }])
  const removed = state[0]
  snapshot(state)
  state.length = 0
  const empty = snapshot(state)

  removed.value = 1
  expect(snapshot(state)).toBe(empty)
  expect(empty).toEqual([])
})
