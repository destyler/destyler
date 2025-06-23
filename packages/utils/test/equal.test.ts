import { describe, expect, it } from 'vitest'
import { isEqual } from '../index'

describe('isEqual', () => {
  it('should return true for equal primitive values', () => {
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual('a', 'a')).toBe(true)
    expect(isEqual(true, true)).toBe(true)
  })

  it('should return false for unequal primitive values', () => {
    expect(isEqual(1, 2)).toBe(false)
    expect(isEqual('a', 'b')).toBe(false)
    expect(isEqual(true, false)).toBe(false)
  })

  it('should return true for equal object values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }
    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should return false for unequal object values', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 2, b: 2 }
    expect(isEqual(obj1, obj2)).toBe(false)
  })

  it('should check deep object values', () => {
    const obj1 = { positioning: { placement: 'start' } }
    const obj2 = { positioning: { placement: 'start' } }
    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should compare with proxy', () => {
    const obj1 = { a: 1, b: 2, c: [1] }
    const obj2 = new Proxy({ a: 1, b: 2, c: [1] }, {})
    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should respect positional equality', () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const arr2 = [{ id: 2 }, { id: 1 }, { id: 3 }]
    expect(isEqual(arr1, arr2)).toBe(false)
  })

  it('should handle null and undefined values', () => {
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, undefined)).toBe(true)
    expect(isEqual(null, undefined)).toBe(false)
    expect(isEqual(null, 0)).toBe(false)
    expect(isEqual(undefined, 0)).toBe(false)
    expect(isEqual(null, '')).toBe(false)
    expect(isEqual(undefined, '')).toBe(false)
  })

  it('should handle special number values', () => {
    expect(isEqual(0, 0)).toBe(true)
    expect(isEqual(-0, -0)).toBe(true)
    expect(isEqual(0, -0)).toBe(false)
    expect(isEqual(Number.NaN, Number.NaN)).toBe(true)
    expect(isEqual(Infinity, Infinity)).toBe(true)
    expect(isEqual(-Infinity, -Infinity)).toBe(true)
    expect(isEqual(Infinity, -Infinity)).toBe(false)
  })

  it('should handle arrays correctly', () => {
    expect(isEqual([], [])).toBe(true)
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  it('should handle nested arrays', () => {
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
    expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false)
    expect(isEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true)
    expect(isEqual([[1, 2], [3, 4]], [[1, 2], [4, 3]])).toBe(false)
  })

  it('should handle objects with different key orders', () => {
    const obj1 = { a: 1, b: 2, c: 3 }
    const obj2 = { c: 3, a: 1, b: 2 }
    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should handle nested objects', () => {
    const obj1 = { a: { b: { c: 1 } } }
    const obj2 = { a: { b: { c: 1 } } }
    const obj3 = { a: { b: { c: 2 } } }
    expect(isEqual(obj1, obj2)).toBe(true)
    expect(isEqual(obj1, obj3)).toBe(false)
  })

  it('should handle empty objects', () => {
    expect(isEqual({}, {})).toBe(true)
    expect(isEqual({}, { a: 1 })).toBe(false)
    expect(isEqual({ a: 1 }, {})).toBe(false)
  })

  it('should handle functions', () => {
    const fn1 = () => 'hello'
    const fn2 = () => 'hello'
    const fn3 = () => 'world'
    expect(isEqual(fn1, fn1)).toBe(true)
    expect(isEqual(fn1, fn2)).toBe(true)
    expect(isEqual(fn1, fn3)).toBe(false)
  })

  it('should handle objects with isEqual method', () => {
    const obj1 = {
      value: 1,
      isEqual(other: any) { return this.value === other.value },
    }
    const obj2 = {
      value: 1,
      isEqual(other: any) { return this.value === other.value },
    }
    const obj3 = {
      value: 2,
      isEqual(other: any) { return this.value === other.value },
    }

    expect(isEqual(obj1, obj2)).toBe(true)
    expect(isEqual(obj1, obj3)).toBe(false)
  })

  it('should handle mixed types', () => {
    expect(isEqual(1, '1')).toBe(false)
    expect(isEqual(true, 1)).toBe(false)
    expect(isEqual(false, 0)).toBe(false)
    expect(isEqual([], {})).toBe(false)
    expect(isEqual([1, 2], { 0: 1, 1: 2 })).toBe(false)
  })

  it('should handle dates', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-01-01')
    const date3 = new Date('2023-01-02')

    expect(isEqual(date1, date2)).toBe(true)
    expect(isEqual(date1, date3)).toBe(false)
    expect(isEqual(date1, date1)).toBe(true)
  })

  it('should handle array-like objects', () => {
    const arrayLike = { 0: 'a', 1: 'b', length: 2, constructor: { name: 'Array' } }
    expect(isEqual(['a', 'b'], arrayLike)).toBe(true)
  })

  it('should handle objects with missing keys', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1 }
    expect(isEqual(obj1, obj2)).toBe(false)
    expect(isEqual(obj2, obj1)).toBe(false)
  })

  it('should handle objects with undefined values', () => {
    const obj1 = { a: undefined, b: 2 }
    const obj2 = { a: undefined, b: 2 }
    const obj3 = { b: 2 }
    expect(isEqual(obj1, obj2)).toBe(true)
    expect(isEqual(obj1, obj3)).toBe(false)
  })

  it('should handle circular references prevention', () => {
    const obj1: any = { a: 1 }
    const obj2: any = { a: 1 }
    obj1.self = obj1
    obj2.self = obj2

    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should handle complex nested structures', () => {
    const complex1 = {
      users: [
        { id: 1, name: 'Alice', preferences: { theme: 'dark', notifications: true } },
        { id: 2, name: 'Bob', preferences: { theme: 'light', notifications: false } },
      ],
      settings: {
        language: 'en',
        features: ['feature1', 'feature2'],
      },
    }

    const complex2 = {
      users: [
        { id: 1, name: 'Alice', preferences: { theme: 'dark', notifications: true } },
        { id: 2, name: 'Bob', preferences: { theme: 'light', notifications: false } },
      ],
      settings: {
        language: 'en',
        features: ['feature1', 'feature2'],
      },
    }

    const complex3 = {
      users: [
        { id: 1, name: 'Alice', preferences: { theme: 'dark', notifications: true } },
        { id: 2, name: 'Bob', preferences: { theme: 'light', notifications: true } },
      ],
      settings: {
        language: 'en',
        features: ['feature1', 'feature2'],
      },
    }

    expect(isEqual(complex1, complex2)).toBe(true)
    expect(isEqual(complex1, complex3)).toBe(false)
  })
})
