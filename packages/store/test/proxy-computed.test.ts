import { describe, expect, it } from 'vitest'
import { snapshot } from '../src/proxy'
import { proxyWithComputed } from '../src/proxy-computed'

describe('proxyWithComputed', () => {
  describe('basic computed properties', () => {
    it('should create computed property from function', () => {
      const state = proxyWithComputed<{ count: number }, { doubled: number }>(
        { count: 1 },
        {
          doubled: snap => snap.count * 2,
        },
      )

      expect(state.count).toBe(1)
      expect(state.doubled).toBe(2)
    })

    it('should update computed when state changes', () => {
      const state = proxyWithComputed<{ count: number }, { doubled: number }>(
        { count: 1 },
        {
          doubled: snap => snap.count * 2,
        },
      )

      expect(state.doubled).toBe(2)
      state.count = 5
      expect(state.doubled).toBe(10)
    })

    it('should handle multiple computed properties', () => {
      const state = proxyWithComputed<
        { count: number },
        { doubled: number, tripled: number, isEven: boolean }
      >(
        { count: 10 },
        {
          doubled: snap => snap.count * 2,
          tripled: snap => snap.count * 3,
          isEven: snap => snap.count % 2 === 0,
        },
      )

      expect(state.doubled).toBe(20)
      expect(state.tripled).toBe(30)
      expect(state.isEven).toBe(true)

      state.count = 7
      expect(state.doubled).toBe(14)
      expect(state.tripled).toBe(21)
      expect(state.isEven).toBe(false)
    })

    it('should handle computed properties depending on multiple state values', () => {
      const state = proxyWithComputed<
        { firstName: string, lastName: string },
        { fullName: string }
      >(
        { firstName: 'John', lastName: 'Doe' },
        {
          fullName: snap => `${snap.firstName} ${snap.lastName}`,
        },
      )

      expect(state.fullName).toBe('John Doe')
      state.firstName = 'Jane'
      expect(state.fullName).toBe('Jane Doe')
      state.lastName = 'Smith'
      expect(state.fullName).toBe('Jane Smith')
    })

    it('should handle nested state properties', () => {
      const state = proxyWithComputed<
        { user: { name: string, age: number } },
        { greeting: string, isAdult: boolean }
      >(
        {
          user: {
            name: 'John',
            age: 30,
          },
        },
        {
          greeting: snap => `Hello, ${snap.user.name}!`,
          isAdult: snap => snap.user.age >= 18,
        },
      )

      expect(state.greeting).toBe('Hello, John!')
      expect(state.isAdult).toBe(true)

      state.user.name = 'Jane'
      expect(state.greeting).toBe('Hello, Jane!')

      state.user.age = 15
      expect(state.isAdult).toBe(false)
    })
  })

  describe('computed with getter and setter', () => {
    it('should support computed with get and set', () => {
      const state = proxyWithComputed<{ count: number }, { doubled: number }>(
        { count: 1 },
        {
          doubled: {
            get: snap => snap.count * 2,
            set: (state, newValue: number) => {
              state.count = newValue / 2
            },
          },
        },
      )

      expect(state.doubled).toBe(2)
      state.doubled = 10
      expect(state.count).toBe(5)
      expect(state.doubled).toBe(10)
    })

    it('should handle multiple computed with setters', () => {
      const state = proxyWithComputed<
        { celsius: number },
        { fahrenheit: number, kelvin: number }
      >(
        { celsius: 0 },
        {
          fahrenheit: {
            get: snap => snap.celsius * 9 / 5 + 32,
            set: (state, newValue: number) => {
              state.celsius = (newValue - 32) * 5 / 9
            },
          },
          kelvin: {
            get: snap => snap.celsius + 273.15,
            set: (state, newValue: number) => {
              state.celsius = newValue - 273.15
            },
          },
        },
      )

      expect(state.celsius).toBe(0)
      expect(state.fahrenheit).toBe(32)
      expect(state.kelvin).toBe(273.15)

      state.fahrenheit = 212
      expect(state.celsius).toBe(100)
      expect(state.kelvin).toBeCloseTo(373.15)

      state.kelvin = 0
      expect(state.celsius).toBeCloseTo(-273.15)
    })

    it('should work with only getter (no setter)', () => {
      const state = proxyWithComputed<{ count: number }, { squared: number }>(
        { count: 5 },
        {
          squared: {
            get: snap => snap.count ** 2,
          },
        },
      )

      expect(state.squared).toBe(25)
      state.count = 3
      expect(state.squared).toBe(9)
    })
  })

  describe('error handling', () => {
    it('should throw error if computed key already exists in initial object', () => {
      expect(() => {
        proxyWithComputed(
          { count: 1, doubled: 2 },
          {
            doubled: snap => snap.count * 2,
          },
        )
      }).toThrow('object property already defined')
    })

    it('should throw error for multiple conflicting keys', () => {
      expect(() => {
        proxyWithComputed(
          { a: 1, b: 2 },
          {
            a: () => 10,
          },
        )
      }).toThrow('object property already defined')
    })
  })

  describe('integration with snapshot', () => {
    it('should work with snapshot function', () => {
      const state = proxyWithComputed(
        { count: 5 },
        {
          doubled: snap => snap.count * 2,
        },
      )

      const snap = snapshot(state)
      expect(snap.count).toBe(5)
      // Note: computed properties may not be included in snapshot
      // depending on implementation
    })
  })

  describe('complex computed scenarios', () => {
    it('should handle array computations', () => {
      const state = proxyWithComputed(
        { items: [1, 2, 3, 4, 5] },
        {
          sum: snap => snap.items.reduce((a, b) => a + b, 0),
          average: snap => snap.items.reduce((a, b) => a + b, 0) / snap.items.length,
          count: snap => snap.items.length,
        },
      )

      expect(state.sum).toBe(15)
      expect(state.average).toBe(3)
      expect(state.count).toBe(5)

      state.items.push(6)
      expect(state.sum).toBe(21)
      expect(state.average).toBe(3.5)
      expect(state.count).toBe(6)
    })

    it('should handle object computations', () => {
      const state = proxyWithComputed(
        {
          items: [
            { name: 'Apple', price: 1.5, quantity: 3 },
            { name: 'Banana', price: 0.5, quantity: 5 },
          ],
        },
        {
          totalPrice: snap => snap.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          totalQuantity: snap => snap.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      )

      expect(state.totalPrice).toBe(1.5 * 3 + 0.5 * 5)
      expect(state.totalQuantity).toBe(8)

      state.items[0].quantity = 10
      expect(state.totalPrice).toBe(1.5 * 10 + 0.5 * 5)
    })

    it('should handle boolean computations', () => {
      const state = proxyWithComputed(
        { todos: [{ done: true }, { done: false }, { done: true }] },
        {
          allDone: snap => snap.todos.every(t => t.done),
          anyDone: snap => snap.todos.some(t => t.done),
          noneLeft: snap => snap.todos.filter(t => !t.done).length === 0,
          remaining: snap => snap.todos.filter(t => !t.done).length,
        },
      )

      expect(state.allDone).toBe(false)
      expect(state.anyDone).toBe(true)
      expect(state.noneLeft).toBe(false)
      expect(state.remaining).toBe(1)

      state.todos[1].done = true
      expect(state.allDone).toBe(true)
      expect(state.noneLeft).toBe(true)
      expect(state.remaining).toBe(0)
    })

    it('should handle string computations', () => {
      const state = proxyWithComputed(
        { words: ['hello', 'world'] },
        {
          sentence: snap => snap.words.join(' '),
          upperCase: snap => snap.words.join(' ').toUpperCase(),
          wordCount: snap => snap.words.length,
        },
      )

      expect(state.sentence).toBe('hello world')
      expect(state.upperCase).toBe('HELLO WORLD')
      expect(state.wordCount).toBe(2)

      state.words.push('!')
      expect(state.sentence).toBe('hello world !')
      expect(state.wordCount).toBe(3)
    })
  })

  describe('edge cases', () => {
    it('should handle empty initial object', () => {
      const state = proxyWithComputed(
        {} as { value?: number },
        {
          computed: () => 'computed value',
        },
      )

      expect(state.computed).toBe('computed value')
    })

    it('should handle computed returning undefined', () => {
      const state = proxyWithComputed(
        { value: null as number | null },
        {
          maybeDouble: snap => snap.value != null ? snap.value * 2 : undefined,
        },
      )

      expect(state.maybeDouble).toBeUndefined()
      state.value = 5
      expect(state.maybeDouble).toBe(10)
    })

    it('should handle computed returning null', () => {
      const state = proxyWithComputed(
        { search: '' },
        {
          result: snap => snap.search.length > 0 ? `Found: ${snap.search}` : null,
        },
      )

      expect(state.result).toBeNull()
      state.search = 'test'
      expect(state.result).toBe('Found: test')
    })

    it('should handle computed returning objects', () => {
      const state = proxyWithComputed(
        { x: 1, y: 2 },
        {
          point: snap => ({ x: snap.x, y: snap.y }),
          distance: snap => Math.sqrt(snap.x ** 2 + snap.y ** 2),
        },
      )

      expect(state.point).toEqual({ x: 1, y: 2 })
      expect(state.distance).toBeCloseTo(Math.sqrt(5))

      state.x = 3
      state.y = 4
      expect(state.point).toEqual({ x: 3, y: 4 })
      expect(state.distance).toBe(5)
    })

    it('should handle computed returning arrays', () => {
      const state = proxyWithComputed(
        { min: 1, max: 5 },
        {
          range: snap => Array.from({ length: snap.max - snap.min + 1 }, (_, i) => snap.min + i),
        },
      )

      expect(state.range).toEqual([1, 2, 3, 4, 5])
      state.max = 3
      expect(state.range).toEqual([1, 2, 3])
    })
  })
})
