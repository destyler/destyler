import { describe, expect, it } from 'vitest'
import { deepMerge } from '../index'

describe('deepMerge', () => {
  it('basic object merging', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: 1, b: 2 })
  })

  it('deep object merging', () => {
    const obj1 = { a: { x: 1 } }
    const obj2 = { a: { y: 2 } }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: { x: 1, y: 2 } })
  })

  it('multiple objects merging', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const obj3 = { c: 3 }
    expect(deepMerge<any>(obj1, obj2, obj3)).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('overwriting primitives', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 2 }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: 2 })
  })

  it('handles nested object overwriting primitive', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: { b: 2 } }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: { b: 2 } })
  })

  // Security Tests
  it('prevents prototype pollution', () => {
    const malicious = { __proto__: { polluted: true } }
    const obj = {}
    deepMerge<any>(obj, malicious)
    expect(({} as any).polluted).toBeUndefined()
  })

  it('prevents constructor pollution', () => {
    const malicious = { constructor: { polluted: true } }
    const obj = {}
    deepMerge<any>(obj, malicious)
    // @ts-expect-error test
    expect(Object.prototype.polluted).toBeUndefined()
  })

  it('prevents prototype key pollution', () => {
    const malicious = { prototype: { polluted: true } }
    const obj = {}
    deepMerge<any>(obj, malicious)
    // @ts-expect-error test
    expect(Object.prototype.polluted).toBeUndefined()
  })

  // Input Validation Tests
  it('throws on non-object source', () => {
    expect(() => deepMerge<any>([] as any, {})).toThrow(TypeError)
    expect(() => deepMerge<any>(null as any, {})).toThrow(TypeError)
    expect(() => deepMerge<any>(42 as any, {})).toThrow(TypeError)
  })

  it('skips non-object arguments', () => {
    expect(() => deepMerge<any>({}, [] as any)).not.toThrow()
    expect(() => deepMerge<any>({}, null as any)).not.toThrow()
    expect(() => deepMerge<any>({}, 42 as any)).not.toThrow()
  })

  // Edge Cases
  it('handles empty objects', () => {
    expect(deepMerge<any>({}, {})).toEqual({})
  })

  it('preserves source object when no arguments provided', () => {
    const source = { a: 1 }
    expect(deepMerge<any>(source)).toEqual({ a: 1 })
  })

  it('handles nested arrays', () => {
    const obj1 = { arr: [1, 2] }
    const obj2 = { arr: [3, 4] }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ arr: [3, 4] })
  })

  it('handles null values', () => {
    const obj1 = { a: null }
    const obj2 = { b: null }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: null, b: null })
  })

  it('handles undefined values', () => {
    const obj1 = { a: undefined }
    const obj2 = { b: undefined }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ a: undefined, b: undefined })
  })

  it('merges nested objects recursively', () => {
    const obj1 = {
      a: { x: 1, y: 2 },
      b: { z: 3 },
    }
    const obj2 = {
      a: { y: 4, w: 5 },
      b: { z: 6 },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      a: { x: 1, y: 4, w: 5 },
      b: { z: 6 },
    })
  })

  it('handles multiple levels of nesting', () => {
    const obj1 = {
      level1: {
        level2: {
          level3: { a: 1 },
        },
      },
    }
    const obj2 = {
      level1: {
        level2: {
          level3: { b: 2 },
        },
      },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      level1: {
        level2: {
          level3: { a: 1, b: 2 },
        },
      },
    })
  })

  it('preserves unmodified nested objects', () => {
    const obj1 = {
      unchanged: { a: 1 },
      changed: { b: 2 },
    }
    const obj2 = {
      changed: { c: 3 },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      unchanged: { a: 1 },
      changed: { b: 2, c: 3 },
    })
  })

  it('handles mixed nested and flat properties', () => {
    const obj1 = {
      flat: 1,
      nested: { a: 2 },
    }
    const obj2 = {
      flat: 3,
      nested: { b: 4 },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      flat: 3,
      nested: { a: 2, b: 4 },
    })
  })

  it('handles mixed object and primitive values', () => {
    const obj1 = {
      key: 'string value',
      another: { nested: true },
    }
    const obj2 = {
      key: { foo: 'bar' },
      another: 42,
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      key: { foo: 'bar' },
      another: 42,
    })
  })

  it('handles mixed primitive and object values (reverse case)', () => {
    const obj1 = {
      key: { foo: 'bar' },
      another: 42,
    }
    const obj2 = {
      key: 'string value',
      another: { nested: true },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      key: 'string value',
      another: { nested: true },
    })
  })

  it('handles object undefined values', () => {
    const obj1 = {
      a: 1,
      b: undefined,
      c: { d: undefined },
    }
    const obj2 = {
      b: 2,
      c: { d: 3 },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      a: 1,
      b: 2,
      c: { d: 3 },
    })
  })

  it('ignores undefined objects in merge', () => {
    const obj1 = {
      a: 1,
      b: { c: 2 },
    }
    const obj2 = undefined
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      a: 1,
      b: { c: 2 },
    })
  })

  it('handles undefined nested objects', () => {
    const obj1 = {
      a: { b: { d: 1 } },
      c: { e: 2 },
    }
    const obj2 = {
      a: { b: undefined },
      c: undefined,
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      a: { b: { d: 1 } },
      c: { e: 2 },
    })
  })

  it('handles objects with functions', () => {
    const fn1 = () => 'hello'
    const fn2 = () => 'world'

    const obj1 = {
      a: fn1,
      b: { c: fn1 },
    }

    const obj2 = {
      a: fn2,
      b: { c: fn2 },
    }

    const result = deepMerge<any>(obj1, obj2)

    expect(result.a).toBe(fn2)
    expect(result.b.c).toBe(fn2)
  })

  // Additional Edge Cases
  it('handles Date objects', () => {
    const date1 = new Date('2023-01-01')
    const date2 = new Date('2023-12-31')
    const obj1 = { date: date1 }
    const obj2 = { date: date2 }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ date: date2 })
  })

  it('handles RegExp objects', () => {
    const regex1 = /test1/g
    const regex2 = /test2/i
    const obj1 = { pattern: regex1 }
    const obj2 = { pattern: regex2 }
    expect(deepMerge<any>(obj1, obj2)).toEqual({ pattern: regex2 })
  })

  it('handles Symbol keys', () => {
    const sym1 = Symbol('test1')
    const sym2 = Symbol('test2')
    const obj1 = { [sym1]: 'value1', regular: 'prop1' }
    const obj2 = { [sym2]: 'value2', regular: 'prop2' }
    const result = deepMerge<any>(obj1, obj2)
    expect(result.regular).toBe('prop2')
    expect(result[sym1]).toBe('value1')
    // Symbol properties are not copied because for...in doesn't iterate over Symbol properties
    expect(result[sym2]).toBeUndefined()
  })

  it('handles getters and setters', () => {
    const obj1 = {
      get value() { return this._value },
      set value(val) { this._value = val },
      _value: 1,
    }
    const obj2 = { _value: 2 }
    const result = deepMerge<any>(obj1, obj2)
    expect(result._value).toBe(2)
    expect(typeof result.value).toBe('number')
  })

  it('preserves non-enumerable properties behavior', () => {
    const obj1 = {}
    const obj2 = {}
    Object.defineProperty(obj2, 'hidden', {
      value: 'secret',
      enumerable: false,
    })
    const result = deepMerge<any>(obj1, obj2)
    // compact function may include non-enumerable properties
    expect(result.hidden).toBe('secret')
  })

  // Performance and Large Object Tests
  it('handles large flat objects', () => {
    const obj1: any = {}
    const obj2: any = {}

    for (let i = 0; i < 1000; i++) {
      obj1[`key${i}`] = i
      obj2[`key${i + 1000}`] = i + 1000
    }

    const result = deepMerge(obj1, obj2)
    expect(Object.keys(result)).toHaveLength(2000)
    expect(result.key0).toBe(0)
    expect(result.key1999).toBe(1999)
  })

  it('handles deeply nested objects', () => {
    const obj1: any = {}
    const obj2: any = {}
    let current1 = obj1
    let current2 = obj2

    // Reduce nesting levels to avoid performance issues
    for (let i = 0; i < 10; i++) {
      current1.nested = { value: i }
      current2.nested = { otherValue: i * 2 }
      current1 = current1.nested
      current2 = current2.nested
    }

    const result = deepMerge(obj1, obj2)
    let currentResult = result
    for (let i = 0; i < 9; i++) {
      currentResult = currentResult.nested
    }
    expect(currentResult.value).toBe(8)
    expect(currentResult.otherValue).toBe(16)
  })

  // Complex Merging Scenarios
  it('handles circular references by throwing error', () => {
    const obj1: any = { a: 1 }
    const obj2: any = { b: 2 }
    obj1.self = obj1
    obj2.self = obj2

    // Current implementation doesn't handle circular references and will throw stack overflow error
    expect(() => deepMerge(obj1, obj2)).toThrow()
  })

  it('handles objects with complex nested arrays', () => {
    const obj1 = {
      matrix: [[1, 2], [3, 4]],
      config: { settings: [{ a: 1 }, { b: 2 }] },
    }
    const obj2 = {
      matrix: [[5, 6], [7, 8]],
      config: { settings: [{ c: 3 }, { d: 4 }] },
    }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      matrix: [[5, 6], [7, 8]],
      config: { settings: [{ c: 3 }, { d: 4 }] },
    })
  })

  it('handles mixed data types in arrays', () => {
    const obj1 = { data: [1, 'string', { nested: true }, [1, 2]] }
    const obj2 = { data: [2, 'other', { nested: false }, [3, 4]] }
    expect(deepMerge<any>(obj1, obj2)).toEqual({
      data: [2, 'other', { nested: false }, [3, 4]],
    })
  })

  // Advanced Security Tests
  it('prevents nested prototype pollution', () => {
    const malicious = {
      nested: {
        __proto__: { polluted: true },
      },
    }
    const obj = { nested: {} }
    deepMerge<any>(obj, malicious)
    expect(({} as any).polluted).toBeUndefined()
  })

  it('handles JSON.parse prototype pollution attempt', () => {
    const maliciousJson = '{"__proto__": {"polluted": true}}'
    const malicious = JSON.parse(maliciousJson)
    const obj = {}
    deepMerge<any>(obj, malicious)
    expect(({} as any).polluted).toBeUndefined()
  })

  // Type Compatibility Tests
  it('maintains type consistency with numbers', () => {
    const obj1 = { value: 42 }
    const obj2 = { value: 3.14 }
    const result = deepMerge(obj1, obj2)
    expect(typeof result.value).toBe('number')
    expect(result.value).toBe(3.14)
  })

  it('maintains type consistency with booleans', () => {
    const obj1 = { flag: true }
    const obj2 = { flag: false }
    const result = deepMerge(obj1, obj2)
    expect(typeof result.flag).toBe('boolean')
    expect(result.flag).toBe(false)
  })

  it('handles BigInt values', () => {
    const obj1 = { big: BigInt(123) }
    const obj2 = { big: BigInt(456) }
    const result = deepMerge<any>(obj1, obj2)
    expect(result.big).toBe(BigInt(456))
  })

  // Error Recovery Tests
  it('continues merging after encountering non-enumerable properties', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { c: 3 }
    Object.defineProperty(obj2, 'nonEnum', {
      value: 'hidden',
      enumerable: false,
    })
    const result = deepMerge<any>(obj1, obj2)
    // compact may include non-enumerable properties
    expect(result).toEqual({ a: 1, b: 2, c: 3, nonEnum: 'hidden' })
  })

  it('handles objects with toString/valueOf overrides', () => {
    const obj1 = {
      toString() { return 'custom1' },
      valueOf() { return 1 },
      data: 'original',
    }
    const obj2 = {
      toString() { return 'custom2' },
      valueOf() { return 2 },
      data: 'updated',
    }
    const result = deepMerge<any>(obj1, obj2)
    expect(result.data).toBe('updated')
    expect(result.toString()).toBe('custom2')
    expect(result.valueOf()).toBe(2)
  })

  // Mutation Tests
  it('does not mutate source objects unnecessarily', () => {
    const original1 = { a: { x: 1 }, b: 2 }
    const original2 = { a: { y: 3 }, c: 4 }
    const copy2 = JSON.parse(JSON.stringify(original2))

    deepMerge(original1, original2)

    // Original2 should remain unchanged
    expect(original2).toEqual(copy2)
  })

  it('preserves object references when no merge needed', () => {
    const nested = { value: 42 }
    const obj1 = { preserved: nested, other: 1 }
    const obj2 = { other: 2 }

    const result = deepMerge<any>(obj1, obj2)
    expect(result.preserved).toBe(nested) // Same reference
  })

  // Empty and Sparse Object Tests
  it('handles objects with only Symbol properties', () => {
    const sym = Symbol('test')
    const obj1 = { [sym]: 'value1' }
    const obj2 = { [sym]: 'value2' }
    const result = deepMerge<any>(obj1, obj2)
    // Symbol properties are not merged, original value is preserved
    expect(result[sym]).toBe('value1')
  })

  it('handles sparse arrays in objects', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr1 = [1, , 3] // sparse array
    // eslint-disable-next-line no-sparse-arrays
    const arr2 = [, 2, 4] // sparse array
    const obj1 = { sparse: arr1 }
    const obj2 = { sparse: arr2 }
    const result = deepMerge<any>(obj1, obj2)
    // eslint-disable-next-line no-sparse-arrays
    expect(result.sparse).toEqual([, 2, 4])
  })

  // Multiple Objects with Complex Scenarios
  it('merges multiple objects with overlapping nested structures', () => {
    const obj1 = { a: { x: 1, y: 2 }, b: 1 }
    const obj2 = { a: { y: 3, z: 4 }, c: 2 }
    const obj3 = { a: { x: 5, w: 6 }, d: 3 }
    const obj4 = { b: 4, e: 5 }

    expect(deepMerge<any>(obj1, obj2, obj3, obj4)).toEqual({
      a: { x: 5, y: 3, z: 4, w: 6 },
      b: 4,
      c: 2,
      d: 3,
      e: 5,
    })
  })

  it('handles multiple objects with different types for same key', () => {
    const obj1 = { value: 'string' }
    const obj2 = { value: 42 }
    const obj3 = { value: { nested: true } }
    const obj4 = { value: [1, 2, 3] }

    expect(deepMerge<any>(obj1, obj2, obj3, obj4)).toEqual({
      value: [1, 2, 3],
    })
  })
})
