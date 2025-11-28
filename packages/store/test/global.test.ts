import { describe, expect, it } from 'vitest'
import { globalRef, refSet } from '../src/global'

describe('global', () => {
  describe('globalRef', () => {
    it('should return the value from the global object if it exists', () => {
      const testKey = '__destyler__test_globalRef_1'
      const value = { test: true }

      // First call should create the value
      const result1 = globalRef(testKey, () => value)
      expect(result1).toBe(value)

      // Second call should return the same value
      const result2 = globalRef(testKey, () => ({ different: true }))
      expect(result2).toBe(value)
    })

    it('should call the value factory only once', () => {
      const testKey = '__destyler__test_globalRef_2'
      let callCount = 0

      globalRef(testKey, () => {
        callCount++
        return { count: callCount }
      })

      globalRef(testKey, () => {
        callCount++
        return { count: callCount }
      })

      expect(callCount).toBe(1)
    })

    it('should work with different value types', () => {
      const numberKey = '__destyler__test_globalRef_number'
      const stringKey = '__destyler__test_globalRef_string'
      const arrayKey = '__destyler__test_globalRef_array'

      expect(globalRef(numberKey, () => 42)).toBe(42)
      expect(globalRef(stringKey, () => 'hello')).toBe('hello')
      expect(globalRef(arrayKey, () => [1, 2, 3])).toEqual([1, 2, 3])
    })

    it('should store different values for different keys', () => {
      const key1 = '__destyler__test_globalRef_different_1'
      const key2 = '__destyler__test_globalRef_different_2'

      const value1 = globalRef(key1, () => 'value1')
      const value2 = globalRef(key2, () => 'value2')

      expect(value1).toBe('value1')
      expect(value2).toBe('value2')
    })

    it('should handle functions as values', () => {
      const testKey = '__destyler__test_globalRef_function'
      const fn = () => 'result'

      const result = globalRef(testKey, () => fn)
      expect(result).toBe(fn)
      expect(result()).toBe('result')
    })

    it('should handle WeakMap as value', () => {
      const testKey = '__destyler__test_globalRef_weakmap'

      const result = globalRef(testKey, () => new WeakMap())
      expect(result).toBeInstanceOf(WeakMap)

      // Should return the same WeakMap
      const result2 = globalRef(testKey, () => new WeakMap())
      expect(result2).toBe(result)
    })

    it('should handle WeakSet as value', () => {
      const testKey = '__destyler__test_globalRef_weakset'

      const result = globalRef(testKey, () => new WeakSet())
      expect(result).toBeInstanceOf(WeakSet)

      // Should return the same WeakSet
      const result2 = globalRef(testKey, () => new WeakSet())
      expect(result2).toBe(result)
    })
  })

  describe('refSet', () => {
    it('should be a WeakSet', () => {
      expect(refSet).toBeInstanceOf(WeakSet)
    })

    it('should be the same instance across multiple imports', () => {
      // This tests that globalRef works correctly for refSet
      const refSet2 = globalRef('__destyler__refSet', () => new WeakSet())
      expect(refSet2).toBe(refSet)
    })

    it('should be able to add and check objects', () => {
      const obj = { test: true }
      refSet.add(obj)
      expect(refSet.has(obj)).toBe(true)
    })

    it('should not have objects that were not added', () => {
      const obj = { notAdded: true }
      expect(refSet.has(obj)).toBe(false)
    })
  })
})
