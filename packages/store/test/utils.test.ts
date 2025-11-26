import { describe, expect, it } from 'vitest'
import { ref } from '../src/proxy'
import { canProxy, isObject } from '../src/utils'

describe('utils', () => {
  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
      expect(isObject(Object.create(null))).toBe(true)
    })

    it('should return true for arrays', () => {
      expect(isObject([])).toBe(true)
      expect(isObject([1, 2, 3])).toBe(true)
    })

    it('should return true for other object types', () => {
      expect(isObject(new Date())).toBe(true)
      expect(isObject(new Map())).toBe(true)
      expect(isObject(new Set())).toBe(true)
      expect(isObject(/regex/)).toBe(true)
      expect(isObject(new Error('error message'))).toBe(true)
      expect(isObject(new WeakMap())).toBe(true)
      expect(isObject(new WeakSet())).toBe(true)
      expect(isObject(new ArrayBuffer(8))).toBe(true)
      expect(isObject(Promise.resolve())).toBe(true)
    })

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false)
    })

    it('should return false for primitive values', () => {
      expect(isObject(undefined)).toBe(false)
      expect(isObject(42)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(false)).toBe(false)
      expect(isObject(Symbol('test'))).toBe(false)
      expect(isObject(BigInt(123))).toBe(false)
    })

    it('should return false for functions', () => {
      expect(isObject(() => {})).toBe(false)
      expect(isObject(() => {})).toBe(false)
      expect(isObject(async () => {})).toBe(false)
    })
  })

  describe('canProxy', () => {
    it('should return true for plain objects', () => {
      expect(canProxy({})).toBe(true)
      expect(canProxy({ a: 1, b: 2 })).toBe(true)
      expect(canProxy(Object.create(null))).toBe(true)
    })

    it('should return true for arrays', () => {
      expect(canProxy([])).toBe(true)
      expect(canProxy([1, 2, 3])).toBe(true)
      expect(canProxy(['a', 'b', 'c'])).toBe(true)
    })

    it('should return true for nested objects and arrays', () => {
      expect(canProxy({ nested: { a: 1 } })).toBe(true)
      expect(canProxy([[1, 2], [3, 4]])).toBe(true)
      expect(canProxy({ arr: [1, 2, 3] })).toBe(true)
    })

    it('should return false for null', () => {
      expect(canProxy(null)).toBe(false)
    })

    it('should return false for primitive values', () => {
      expect(canProxy(undefined)).toBe(false)
      expect(canProxy(42)).toBe(false)
      expect(canProxy('string')).toBe(false)
      expect(canProxy(true)).toBe(false)
      expect(canProxy(Symbol('test'))).toBe(false)
    })

    it('should return false for WeakMap', () => {
      expect(canProxy(new WeakMap())).toBe(false)
    })

    it('should return false for WeakSet', () => {
      expect(canProxy(new WeakSet())).toBe(false)
    })

    it('should return false for Error', () => {
      expect(canProxy(new Error('test'))).toBe(false)
      expect(canProxy(new TypeError('type error'))).toBe(false)
      expect(canProxy(new RangeError('range error'))).toBe(false)
    })

    it('should return false for Date', () => {
      expect(canProxy(new Date())).toBe(false)
      expect(canProxy(new Date('2023-01-01'))).toBe(false)
    })

    it('should return false for RegExp', () => {
      expect(canProxy(/test/)).toBe(false)
      expect(canProxy(/pattern/gi)).toBe(false)
    })

    it('should return false for ArrayBuffer', () => {
      expect(canProxy(new ArrayBuffer(8))).toBe(false)
    })

    it('should return false for Promise', () => {
      expect(canProxy(Promise.resolve())).toBe(false)
      expect(canProxy(new Promise(() => {}))).toBe(false)
    })

    it('should return false for objects with Symbol.iterator (except arrays)', () => {
      expect(canProxy(new Map())).toBe(false)
      expect(canProxy(new Set())).toBe(false)
      expect(canProxy('string')).toBe(false)
    })

    it('should return false for objects in refSet', () => {
      const obj = { a: 1 }
      expect(canProxy(obj)).toBe(true)

      // After adding to refSet via ref()
      ref(obj)
      expect(canProxy(obj)).toBe(false)
    })

    it('should return false for react elements', () => {
      const reactElement = {
        $$typeof: Symbol.for('react.element'),
        props: { children: 'test' },
      }
      expect(canProxy(reactElement)).toBe(false)
    })

    it('should return false for vue vnodes', () => {
      const vueVNode = {
        __v_isVNode: true,
        type: 'div',
        props: {},
      }
      expect(canProxy(vueVNode)).toBe(false)
    })

    it('should return false for DOM elements', () => {
      // Mock a DOM element
      const domElement = {
        nodeType: 1,
        nodeName: 'DIV',
      }
      expect(canProxy(domElement)).toBe(false)
    })

    it('should handle edge cases', () => {
      // Object with custom prototype
      const customProto = Object.create({ custom: true })
      expect(canProxy(customProto)).toBe(true)

      // Empty object
      expect(canProxy({})).toBe(true)

      // Object with only symbol keys
      const symObj = { [Symbol('key')]: 'value' }
      expect(canProxy(symObj)).toBe(true)
    })
  })
})
