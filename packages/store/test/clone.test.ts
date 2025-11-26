import { describe, expect, it } from 'vitest'
import { clone } from '../src/clone'

describe('clone', () => {
  describe('primitive values', () => {
    it('should return primitive values as-is', () => {
      expect(clone(42)).toBe(42)
      expect(clone('hello')).toBe('hello')
      expect(clone(true)).toBe(true)
      expect(clone(false)).toBe(false)
      expect(clone(null)).toBe(null)
      expect(clone(undefined)).toBe(undefined)
      expect(clone(Symbol.for('test'))).toBe(Symbol.for('test'))
    })

    it('should return NaN and Infinity correctly', () => {
      expect(Number.isNaN(clone(Number.NaN))).toBe(true)
      expect(clone(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
      expect(clone(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY)
    })
  })

  describe('plain objects', () => {
    it('should clone a simple object', () => {
      const original = { a: 1, b: 'hello', c: true }
      const cloned = clone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })

    it('should clone nested objects', () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      }
      const cloned = clone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      // Note: nested objects that canProxy returns true for are NOT deep cloned
      // They keep the same reference for use with proxy store
      expect(cloned.b).toBe(original.b)
      expect(cloned.b.d).toBe(original.b.d)
    })

    it('should clone objects with null prototype', () => {
      const original = Object.create(null)
      original.a = 1
      original.b = 2

      const cloned = clone(original)

      expect(cloned.a).toBe(1)
      expect(cloned.b).toBe(2)
      expect(Object.getPrototypeOf(cloned)).toBe(null)
    })

    it('should clone objects with custom prototype', () => {
      const proto = {
        greet() {
          return 'hello'
        },
      }
      const original = Object.create(proto)
      original.name = 'test'

      const cloned = clone(original)

      expect(cloned.name).toBe('test')
      expect(Object.getPrototypeOf(cloned)).toBe(proto)
      expect(cloned.greet()).toBe('hello')
    })

    it('should handle non-enumerable properties', () => {
      const original: { visible: number, hidden?: number } = { visible: 1 }
      Object.defineProperty(original, 'hidden', {
        value: 2,
        enumerable: false,
        configurable: true,
        writable: true,
      })

      const cloned = clone(original)

      expect(cloned.visible).toBe(1)
      expect(cloned.hidden).toBe(2)
      expect(Object.getOwnPropertyDescriptor(cloned, 'hidden')?.enumerable).toBe(false)
    })

    it('should handle getter and setter properties', () => {
      let value = 10
      const original: { value: number } = {} as any
      Object.defineProperty(original, 'value', {
        get() { return value },
        set(v) { value = v },
        enumerable: true,
        configurable: true,
      })

      const cloned = clone(original)

      expect(Object.getOwnPropertyDescriptor(cloned, 'value')?.get).toBeDefined()
      expect(Object.getOwnPropertyDescriptor(cloned, 'value')?.set).toBeDefined()
    })
  })

  describe('arrays', () => {
    it('should clone a simple array', () => {
      const original = [1, 2, 3, 4, 5]
      const cloned = clone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
    })

    it('should clone nested arrays', () => {
      const original = [[1, 2], [3, [4, 5]]]
      const cloned = clone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      // Note: nested arrays that canProxy returns true for are NOT deep cloned
      expect(cloned[0]).toBe(original[0])
      expect(cloned[1]).toBe(original[1])
      expect(cloned[1][1]).toBe(original[1][1])
    })

    it('should clone arrays with mixed types', () => {
      const original = [1, 'hello', true, { a: 1 }, [2, 3]]
      const cloned = clone(original)

      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      // Note: nested objects/arrays that canProxy returns true for are NOT deep cloned
      expect(cloned[3]).toBe(original[3])
      expect(cloned[4]).toBe(original[4])
    })

    it('should preserve array length property', () => {
      const original = [1, 2, 3]
      const cloned = clone(original)

      expect(cloned.length).toBe(original.length)
    })

    it('should clone sparse arrays', () => {
      const original: (number | undefined)[] = []
      original[0] = 1
      original[5] = 5

      const cloned = clone(original)

      expect(cloned.length).toBe(6)
      expect(cloned[0]).toBe(1)
      expect(cloned[5]).toBe(5)
      // Note: Array.from creates a dense array, so sparse holes become undefined
      expect(cloned[1]).toBe(undefined)
    })
  })

  describe('set', () => {
    it('should clone a Set with primitive values', () => {
      const original = new Set([1, 2, 3, 'hello'])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Set)
      expect(cloned).not.toBe(original)
      expect(cloned.size).toBe(original.size)
      expect(cloned.has(1)).toBe(true)
      expect(cloned.has(2)).toBe(true)
      expect(cloned.has(3)).toBe(true)
      expect(cloned.has('hello')).toBe(true)
    })

    it('should clone a Set with object values', () => {
      const obj1 = { a: 1 }
      const obj2 = { b: 2 }
      const original = new Set([obj1, obj2])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Set)
      expect(cloned.size).toBe(2)

      // Objects in the cloned Set should be clones, not the same references
      const clonedArray = Array.from(cloned)
      expect(clonedArray[0]).not.toBe(obj1)
      expect(clonedArray[1]).not.toBe(obj2)
    })
  })

  describe('map', () => {
    it('should clone a Map with primitive keys and values', () => {
      const original = new Map<string, number>([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Map)
      expect(cloned).not.toBe(original)
      expect(cloned.size).toBe(original.size)
      expect(cloned.get('a')).toBe(1)
      expect(cloned.get('b')).toBe(2)
      expect(cloned.get('c')).toBe(3)
    })

    it('should clone a Map with object keys and values', () => {
      const key1 = { id: 1 }
      const key2 = { id: 2 }
      const value1 = { name: 'one' }
      const value2 = { name: 'two' }
      const original = new Map([
        [key1, value1],
        [key2, value2],
      ])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Map)
      expect(cloned.size).toBe(2)

      // Keys and values should be cloned
      const clonedEntries = Array.from(cloned.entries())
      expect(clonedEntries[0][0]).not.toBe(key1)
      expect(clonedEntries[0][1]).not.toBe(value1)
    })
  })

  describe('date', () => {
    it('should clone a Date object', () => {
      const original = new Date('2023-01-15T12:00:00Z')
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Date)
      expect(cloned).not.toBe(original)
      expect(cloned.getTime()).toBe(original.getTime())
    })

    it('should clone Date with different timestamps', () => {
      const dates = [
        new Date(0),
        new Date('1999-12-31T23:59:59Z'),
        new Date('2099-06-15T10:30:00Z'),
      ]

      dates.forEach((original) => {
        const cloned = clone(original)
        expect(cloned.getTime()).toBe(original.getTime())
        expect(cloned).not.toBe(original)
      })
    })
  })

  describe('regExp', () => {
    it('should clone a RegExp without flags', () => {
      const original = /hello/
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(RegExp)
      expect(cloned).not.toBe(original)
      expect(cloned.source).toBe(original.source)
      expect(cloned.flags).toBe(original.flags)
    })

    it('should clone a RegExp with flags', () => {
      const original = /hello/gi
      const cloned = clone(original)

      expect(cloned.source).toBe('hello')
      expect(cloned.flags).toBe('gi')
    })

    it('should clone complex RegExp patterns', () => {
      const original = /^[a-z]+\d{2,4}$/gim
      const cloned = clone(original)

      expect(cloned.source).toBe(original.source)
      expect(cloned.flags).toBe(original.flags)
      expect(cloned.test('abc123')).toBe(original.test('abc123'))
    })
  })

  describe('arrayBuffer and typedArrays', () => {
    it('should clone an ArrayBuffer', () => {
      const original = new ArrayBuffer(8)
      const view = new Uint8Array(original)
      view.set([1, 2, 3, 4, 5, 6, 7, 8])

      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(ArrayBuffer)
      expect(cloned).not.toBe(original)
      expect(cloned.byteLength).toBe(original.byteLength)

      const clonedView = new Uint8Array(cloned)
      expect(Array.from(clonedView)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    })

    it('should clone Uint8Array', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Uint8Array)
      expect(cloned).not.toBe(original)
      expect(Array.from(cloned)).toEqual(Array.from(original))
    })

    it('should clone Int32Array', () => {
      const original = new Int32Array([100, 200, -300, 400])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Int32Array)
      expect(cloned).not.toBe(original)
      expect(Array.from(cloned)).toEqual(Array.from(original))
    })

    it('should clone Float64Array', () => {
      const original = new Float64Array([1.1, 2.2, 3.3])
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Float64Array)
      expect(cloned).not.toBe(original)
      expect(Array.from(cloned)).toEqual(Array.from(original))
    })
  })

  describe('dataView', () => {
    it('should clone a DataView', () => {
      const buffer = new ArrayBuffer(16)
      const original = new DataView(buffer)
      original.setInt32(0, 42)
      original.setFloat32(4, 3.14)

      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(DataView)
      expect(cloned).not.toBe(original)
      expect(cloned.buffer).not.toBe(original.buffer)
      expect(cloned.getInt32(0)).toBe(42)
      expect(cloned.getFloat32(4)).toBeCloseTo(3.14, 5)
    })
  })

  describe('blob', () => {
    it('should clone a Blob', () => {
      const original = new Blob(['hello world'], { type: 'text/plain' })
      const cloned = clone(original)

      expect(cloned).toBeInstanceOf(Blob)
      expect(cloned).not.toBe(original)
      expect(cloned.size).toBe(original.size)
      expect(cloned.type).toBe(original.type)
    })
  })

  describe('symbol properties', () => {
    it('should clone objects with symbol keys', () => {
      const sym1 = Symbol('key1')
      const sym2 = Symbol('key2')
      const original = {
        [sym1]: 'value1',
        [sym2]: { nested: true },
        regular: 'normal',
      }

      const cloned = clone(original)

      expect(cloned[sym1]).toBe('value1')
      expect(cloned[sym2]).toEqual({ nested: true })
      // Note: nested objects that canProxy returns true for are NOT deep cloned
      expect(cloned[sym2]).toBe(original[sym2])
      expect(cloned.regular).toBe('normal')
    })
  })

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      expect(clone({})).toEqual({})
    })

    it('should handle empty arrays', () => {
      expect(clone([])).toEqual([])
    })

    it('should handle deeply nested structures', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: { value: 'deep' },
              },
            },
          },
        },
      }

      const cloned = clone(original)

      expect(cloned.level1.level2.level3.level4.level5.value).toBe('deep')
      // Note: nested objects that canProxy returns true for are NOT deep cloned
      expect(cloned.level1).toBe(original.level1)
    })

    it('should handle objects with __proto__ property', () => {
      const original = { a: 1 }
      Object.defineProperty(original, '__proto__', {
        value: { custom: true },
        enumerable: true,
        configurable: true,
        writable: true,
      })

      const cloned = clone(original)

      expect(cloned.a).toBe(1)
    })

    it('should handle mixed complex structures', () => {
      const original = {
        array: [1, 2, { nested: true }],
        set: new Set([1, 2, 3]),
        map: new Map([['key', 'value']]),
        date: new Date('2023-01-01'),
        regex: /test/gi,
        nested: {
          array: [[1], [2]],
        },
      }

      const cloned = clone(original)

      expect(cloned.array).toEqual(original.array)
      // Note: arrays that canProxy returns true for are NOT deep cloned
      expect(cloned.array).toBe(original.array)
      expect(cloned.set).toEqual(original.set)
      expect(cloned.set).not.toBe(original.set)
      expect(cloned.map).toEqual(original.map)
      expect(cloned.map).not.toBe(original.map)
      expect(cloned.date.getTime()).toBe(original.date.getTime())
      expect(cloned.date).not.toBe(original.date)
      expect(cloned.regex.source).toBe(original.regex.source)
      expect(cloned.regex).not.toBe(original.regex)
    })
  })
})
