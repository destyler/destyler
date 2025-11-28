import { describe, expect, it, vi } from 'vitest'
import { getVersion, proxy, ref, snapshot, subscribe } from '../src/proxy'

describe('proxy', () => {
  describe('proxy function', () => {
    it('should create a proxy from a plain object', () => {
      const state = proxy({ count: 0 })
      expect(state.count).toBe(0)
    })

    it('should create a proxy from an empty object', () => {
      const state = proxy({})
      expect(state).toEqual({})
    })

    it('should create a proxy with default empty object', () => {
      const state = proxy()
      expect(state).toEqual({})
    })

    it('should throw error for non-object values', () => {
      expect(() => proxy(42 as any)).toThrow('object required')
      expect(() => proxy('string' as any)).toThrow('object required')
      expect(() => proxy(null as any)).toThrow('object required')
    })

    it('should allow setting properties', () => {
      const state = proxy({ count: 0 })
      state.count = 10
      expect(state.count).toBe(10)
    })

    it('should allow adding new properties', () => {
      const state = proxy<{ count: number, name?: string }>({ count: 0 })
      state.name = 'test'
      expect(state.name).toBe('test')
    })

    it('should allow deleting properties', () => {
      const state = proxy<{ count: number, name?: string }>({ count: 0, name: 'test' })
      delete state.name
      expect(state.name).toBeUndefined()
    })

    it('should handle nested objects', () => {
      const state = proxy({
        user: {
          name: 'John',
          age: 30,
        },
      })

      expect(state.user.name).toBe('John')
      state.user.name = 'Jane'
      expect(state.user.name).toBe('Jane')
    })

    it('should handle arrays', () => {
      const state = proxy({ items: [1, 2, 3] })
      expect(state.items).toEqual([1, 2, 3])

      state.items.push(4)
      expect(state.items).toEqual([1, 2, 3, 4])

      state.items[0] = 10
      expect(state.items[0]).toBe(10)
    })

    it('should handle deeply nested structures', () => {
      const state = proxy({
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      })

      expect(state.level1.level2.level3.value).toBe('deep')
      state.level1.level2.level3.value = 'modified'
      expect(state.level1.level2.level3.value).toBe('modified')
    })

    it('should return the same proxy for the same initial object', () => {
      const initial = { count: 0 }
      const proxy1 = proxy(initial)
      const proxy2 = proxy(initial)

      expect(proxy1).toBe(proxy2)
    })

    it('should handle objects with getters and setters', () => {
      let _value = 10
      const state = proxy({
        get value() {
          return _value
        },
        set value(v) {
          _value = v
        },
      })

      expect(state.value).toBe(10)
      state.value = 20
      expect(state.value).toBe(20)
    })

    it('should proxy nested objects automatically', () => {
      const state = proxy({ data: null as { value: number } | null })
      state.data = { value: 42 }

      // The nested object should also be proxied
      expect(state.data.value).toBe(42)
      state.data.value = 100
      expect(state.data.value).toBe(100)
    })
  })

  describe('subscribe', () => {
    it('should call callback when property changes', async () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      subscribe(state, callback)
      state.count = 1

      await Promise.resolve()
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should batch multiple changes in one callback by default', async () => {
      const state = proxy({ count: 0, name: 'test' })
      const callback = vi.fn()

      subscribe(state, callback)
      state.count = 1
      state.count = 2
      state.name = 'updated'

      await Promise.resolve()
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0]).toHaveLength(3)
    })

    it('should call callback synchronously when notifyInSync is true', () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      subscribe(state, callback, true)
      state.count = 1

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should provide operation details in callback', async () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      subscribe(state, callback, true)
      state.count = 10

      expect(callback).toHaveBeenCalledWith([
        ['set', ['count'], 10, 0],
      ])
    })

    it('should handle delete operations', async () => {
      const state = proxy<{ count: number, name?: string }>({ count: 0, name: 'test' })
      const callback = vi.fn()

      subscribe(state, callback, true)
      delete state.name

      expect(callback).toHaveBeenCalled()
      expect(callback.mock.calls[0][0][0][0]).toBe('delete')
    })

    it('should return unsubscribe function', async () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      const unsubscribe = subscribe(state, callback)
      state.count = 1
      await Promise.resolve()
      expect(callback).toHaveBeenCalledTimes(1)

      unsubscribe()
      state.count = 2
      await Promise.resolve()
      expect(callback).toHaveBeenCalledTimes(1) // Still 1, not called again
    })

    it('should clean up nested listeners when unsubscribing last listener', async () => {
      const state = proxy({ nested: { value: 1 } })
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      const unsubscribe1 = subscribe(state, callback1, true)
      const unsubscribe2 = subscribe(state, callback2, true)

      state.nested.value = 2
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)

      unsubscribe1()
      state.nested.value = 3
      expect(callback1).toHaveBeenCalledTimes(1) // Not called again
      expect(callback2).toHaveBeenCalledTimes(2)

      // Unsubscribe the last listener - should clean up nested listeners
      unsubscribe2()
      state.nested.value = 4
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(2)
    })

    it('should handle nested property changes', async () => {
      const state = proxy({ user: { name: 'John' } })
      const callback = vi.fn()

      subscribe(state, callback, true)
      state.user.name = 'Jane'

      expect(callback).toHaveBeenCalled()
      expect(callback.mock.calls[0][0][0][1]).toEqual(['user', 'name'])
    })

    it('should handle array modifications', async () => {
      const state = proxy({ items: [1, 2, 3] })
      const callback = vi.fn()

      subscribe(state, callback, true)
      state.items.push(4)

      expect(callback).toHaveBeenCalled()
    })

    it('should not call callback after unsubscribe', async () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      const unsubscribe = subscribe(state, callback, true)
      unsubscribe()

      state.count = 1
      expect(callback).not.toHaveBeenCalled()
    })

    it('should handle multiple subscribers', async () => {
      const state = proxy({ count: 0 })
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      subscribe(state, callback1, true)
      subscribe(state, callback2, true)

      state.count = 1

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should not trigger callback when value is the same', async () => {
      const state = proxy({ count: 0 })
      const callback = vi.fn()

      subscribe(state, callback)
      state.count = 0 // Same value

      await Promise.resolve()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('snapshot', () => {
    it('should create an immutable snapshot', () => {
      const state = proxy({ count: 0 })
      const snap = snapshot(state)

      expect(snap.count).toBe(0)
      expect(Object.isFrozen(snap)).toBe(true)
    })

    it('should reflect current state', () => {
      const state = proxy({ count: 0 })

      const snap1 = snapshot(state)
      expect(snap1.count).toBe(0)

      state.count = 10
      const snap2 = snapshot(state)
      expect(snap2.count).toBe(10)

      // Old snapshot should still have old value
      expect(snap1.count).toBe(0)
    })

    it('should handle nested objects', () => {
      const state = proxy({
        user: { name: 'John', age: 30 },
      })

      const snap = snapshot(state)
      expect(snap.user.name).toBe('John')
      expect(Object.isFrozen(snap.user)).toBe(true)
    })

    it('should handle arrays', () => {
      const state = proxy({ items: [1, 2, 3] })
      const snap = snapshot(state)

      expect(snap.items).toEqual([1, 2, 3])
      expect(Object.isFrozen(snap.items)).toBe(true)
    })

    it('should cache snapshots with same version', () => {
      const state = proxy({ count: 0 })

      const snap1 = snapshot(state)
      const snap2 = snapshot(state)

      expect(snap1).toBe(snap2)
    })

    it('should create new snapshot after state change', () => {
      const state = proxy({ count: 0 })

      const snap1 = snapshot(state)
      state.count = 1
      const snap2 = snapshot(state)

      expect(snap1).not.toBe(snap2)
      expect(snap1.count).toBe(0)
      expect(snap2.count).toBe(1)
    })

    it('should handle ref values in snapshot', () => {
      const refObj = ref({ special: true })
      const state = proxy({ data: refObj })

      const snap = snapshot(state)
      // ref objects should be included as-is, not frozen
      expect(snap.data).toBe(refObj)
    })
  })

  describe('ref', () => {
    it('should mark object as ref', () => {
      const obj = { value: 42 }
      const refObj = ref(obj)

      expect(refObj).toBe(obj)
    })

    it('should prevent object from being proxied', () => {
      const obj = { value: 42 }
      const refObj = ref(obj)

      const state = proxy({ data: refObj })

      // Changes to refObj should not trigger proxy behavior
      refObj.value = 100
      expect(state.data.value).toBe(100)
    })

    it('should preserve reference equality', () => {
      const obj = { value: 42 }
      const refObj = ref(obj)

      const state = proxy({ data: refObj })
      const snap = snapshot(state)

      expect(snap.data).toBe(obj)
    })

    it('should work with complex objects', () => {
      const complexObj = {
        nested: {
          value: 'test',
        },
        array: [1, 2, 3],
      }
      const refObj = ref(complexObj)

      const state = proxy({ data: refObj })
      expect(state.data).toBe(complexObj)
    })
  })

  describe('getVersion', () => {
    it('should return version number for proxy', () => {
      const state = proxy({ count: 0 })
      const version = getVersion(state)

      expect(typeof version).toBe('number')
    })

    it('should return undefined for non-proxy objects', () => {
      const obj = { count: 0 }
      const version = getVersion(obj)

      expect(version).toBeUndefined()
    })

    it('should increase version after changes', async () => {
      const state = proxy({ count: 0 })

      // Subscribe to ensure version is tracked
      const callback = vi.fn()
      subscribe(state, callback)

      const version1 = getVersion(state)
      state.count = 1
      await Promise.resolve()
      const version2 = getVersion(state)

      expect(version2).toBeGreaterThan(version1!)
    })

    it('should track nested changes', async () => {
      const state = proxy({ user: { name: 'John' } })
      const callback = vi.fn()
      subscribe(state, callback)

      const version1 = getVersion(state)
      state.user.name = 'Jane'
      await Promise.resolve()
      const version2 = getVersion(state)

      expect(version2).toBeGreaterThan(version1!)
    })
  })

  describe('edge cases', () => {
    it('should handle circular references carefully', () => {
      interface CircularState {
        name: string
        self?: CircularState
      }
      const state = proxy<CircularState>({ name: 'root' })
      state.self = state

      expect(state.self).toBe(state)
      expect(state.self.name).toBe('root')
    })

    it('should handle replacing nested proxy', async () => {
      const state = proxy({
        data: { value: 1 },
      })

      const callback = vi.fn()
      subscribe(state, callback, true)

      state.data = { value: 2 }
      expect(callback).toHaveBeenCalled()
      expect(state.data.value).toBe(2)
    })

    it('should handle array methods', async () => {
      const state = proxy({ items: [3, 1, 2] })
      const callback = vi.fn()
      subscribe(state, callback, true)

      state.items.sort()
      expect(state.items).toEqual([1, 2, 3])
    })

    it('should handle splice operation', async () => {
      const state = proxy({ items: [1, 2, 3, 4, 5] })

      state.items.splice(2, 1)
      expect(state.items).toEqual([1, 2, 4, 5])

      state.items.splice(1, 0, 10, 20)
      expect(state.items).toEqual([1, 10, 20, 2, 4, 5])
    })

    it('should handle Object.assign', () => {
      const state = proxy({ a: 1, b: 2 })

      Object.assign(state, { b: 20, c: 30 })
      expect(state).toEqual({ a: 1, b: 20, c: 30 })
    })

    it('should handle spread operator for reading', () => {
      const state = proxy({ a: 1, b: 2 })
      const copy = { ...state }

      expect(copy).toEqual({ a: 1, b: 2 })
    })

    it('should not proxy Date objects', () => {
      const date = new Date('2023-01-01')
      const state = proxy({ date })

      expect(state.date).toBe(date)
      expect(state.date instanceof Date).toBe(true)
    })

    it('should not proxy Map objects', () => {
      const map = new Map([['key', 'value']])
      const state = proxy({ map })

      expect(state.map).toBe(map)
      expect(state.map instanceof Map).toBe(true)
    })

    it('should not proxy Set objects', () => {
      const set = new Set([1, 2, 3])
      const state = proxy({ set })

      expect(state.set).toBe(set)
      expect(state.set instanceof Set).toBe(true)
    })

    it('should handle null values', () => {
      const state = proxy<{ value: null | { data: number } }>({ value: null })

      expect(state.value).toBe(null)
      state.value = { data: 42 }
      expect(state.value.data).toBe(42)
    })

    it('should handle undefined values', () => {
      const state = proxy<{ value?: number }>({})

      expect(state.value).toBeUndefined()
      state.value = 42
      expect(state.value).toBe(42)
    })
  })
})
