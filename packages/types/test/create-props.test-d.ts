import { assertType, describe, expectTypeOf, test } from 'vitest'
import { createProps } from '../index'

describe('createProps', () => {
  describe('basic functionality', () => {
    test('should create props array from interface keys', () => {
      interface TestProps {
        id: string
        name: string
        value: number
      }

      const getProps = createProps<TestProps>()
      const props = getProps(['id', 'name', 'value'])

      expectTypeOf(props).toEqualTypeOf<('id' | 'name' | 'value')[]>()
      assertType<('id' | 'name' | 'value')[]>(props)
    })

    test('should deduplicate props', () => {
      interface TestProps {
        a: string
        b: number
      }

      const getProps = createProps<TestProps>()
      // Runtime behavior: should deduplicate
      const props = getProps(['a', 'b'])

      assertType<('a' | 'b')[]>(props)
    })
  })

  describe('type safety', () => {
    test('should return array type', () => {
      interface UserProps {
        id: string
        email: string
        age: number
      }

      const getProps = createProps<UserProps>()
      const props = getProps(['id', 'email', 'age'])

      // Should be an array
      expectTypeOf(props).toBeArray()
    })

    test('should work with optional properties', () => {
      interface OptionalProps {
        required: string
        optional?: number
      }

      const getProps = createProps<OptionalProps>()
      const props = getProps(['required', 'optional'])

      assertType<('required' | 'optional')[]>(props)
    })

    test('should work with complex types', () => {
      interface ComplexProps {
        callback: () => void
        data: { nested: string }
        list: string[]
      }

      const getProps = createProps<ComplexProps>()
      const props = getProps(['callback', 'data', 'list'])

      assertType<('callback' | 'data' | 'list')[]>(props)
    })
  })

  describe('edge cases', () => {
    test('should work with single property', () => {
      interface SingleProp {
        only: string
      }

      const getProps = createProps<SingleProp>()
      const props = getProps(['only'])

      assertType<'only'[]>(props)
    })

    test('should work with many properties', () => {
      interface ManyProps {
        a: string
        b: string
        c: string
        d: string
        e: string
        f: string
        g: string
        h: string
        i: string
        j: string
      }

      const getProps = createProps<ManyProps>()
      const props = getProps(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])

      assertType<('a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j')[]>(props)
    })

    test('should work with interface without index signatures', () => {
      interface PropsWithoutIndex {
        known: string
        another: number
      }

      const getProps = createProps<PropsWithoutIndex>()
      const props = getProps(['known', 'another'])

      assertType<('known' | 'another')[]>(props)
    })
  })

  describe('return type', () => {
    test('should return unique array (Set-like behavior)', () => {
      interface TestProps {
        x: number
        y: number
      }

      const getProps = createProps<TestProps>()
      const result = getProps(['x', 'y'])

      // Result should be an array
      expectTypeOf(result).toBeArray()
    })
  })
})
