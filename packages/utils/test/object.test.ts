import { describe, expect, it } from 'vitest'
import { compact, createSplitProps, json, omit, pick, splitProps } from '../index'

describe('compact()', () => {
  it('should compact object', () => {
    const obj = {
      a: 1,
      b: undefined,
      c: {
        d: 2,
        e: undefined,
      },
    }

    const expected = {
      a: 1,
      c: {
        d: 2,
      },
    }

    expect(compact(obj)).toEqual(expected)
  })

  it('should preserve null', () => {
    const obj = {
      a: 1,
      b: null,
      c: {
        d: 2,
        e: null,
      },
    }

    const expected = {
      a: 1,
      b: null,
      c: {
        d: 2,
        e: null,
      },
    }

    expect(compact(obj)).toEqual(expected)
  })

  it('should handle nested objects', () => {
    const obj = {
      a: {
        b: {
          c: undefined,
          d: 'value',
        },
        e: undefined,
      },
      f: 123,
    }

    const expected = {
      a: {
        b: {
          d: 'value',
        },
      },
      f: 123,
    }

    expect(compact(obj)).toEqual(expected)
  })

  it('should return undefined for undefined input', () => {
    expect(compact(undefined)).toBe(undefined)
  })

  it('should return non-object values as-is', () => {
    expect(compact('string' as any)).toBe('string')
    expect(compact(123 as any)).toBe(123)
    expect(compact(null as any)).toBe(null)
  })
})

describe('pick()', () => {
  it('should pick specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = pick(obj, ['a', 'c'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should ignore non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj as any, ['a', 'c'])
    expect(result).toEqual({ a: 1 })
  })

  it('should handle empty keys array', () => {
    const obj = { a: 1, b: 2 }
    const result = pick(obj, [])
    expect(result).toEqual({})
  })

  it('should exclude undefined values', () => {
    const obj = { a: 1, b: undefined, c: 3 }
    const result = pick(obj, ['a', 'b', 'c'])
    expect(result).toEqual({ a: 1, c: 3 })
  })
})

describe('omit()', () => {
  it('should omit specified keys', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 }
    const result = omit(obj, ['b', 'd'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should handle non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, ['c', 'd'])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should handle empty keys array', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, [])
    expect(result).toEqual({ a: 1, b: 2 })
  })
})

describe('splitProps()', () => {
  it('should split props correctly', () => {
    const props = { a: 1, b: 2, c: 3, d: 4 }
    const [picked, rest] = splitProps(props, ['a', 'c'])

    expect(picked).toEqual({ a: 1, c: 3 })
    expect(rest).toEqual({ b: 2, d: 4 })
  })

  it('should handle overlapping keys', () => {
    const props = { a: 1, b: 2, c: 3 }
    const [picked, rest] = splitProps(props, ['a', 'b', 'c'])

    expect(picked).toEqual({ a: 1, b: 2, c: 3 })
    expect(rest).toEqual({})
  })

  it('should handle empty props', () => {
    const props = {}
    const [picked, rest] = splitProps(props as any, ['a', 'b'])

    expect(picked).toEqual({})
    expect(rest).toEqual({})
  })
})

describe('createSplitProps()', () => {
  it('should create a split function', () => {
    const splitFn = createSplitProps(['a', 'b'])
    const props = { a: 1, b: 2, c: 3, d: 4 }
    const [picked, rest] = splitFn(props)

    expect(picked).toEqual({ a: 1, b: 2 })
    expect(rest).toEqual({ c: 3, d: 4 })
  })

  it('should preserve types correctly', () => {
    interface TestProps {
      id: string
      name: string
      value: number
      extra: boolean
    }

    const splitFn = createSplitProps<{ id: string, name: string }>(['id', 'name'])
    const props: TestProps = { id: '1', name: 'test', value: 42, extra: true }
    const [picked, rest] = splitFn(props)

    expect(picked).toEqual({ id: '1', name: 'test' })
    expect(rest).toEqual({ value: 42, extra: true })
  })
})

describe('json()', () => {
  it('should deep clone objects', () => {
    const obj = { a: 1, b: { c: 2, d: [3, 4] } }
    const cloned = json(obj)

    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.b).not.toBe(obj.b)
    expect(cloned.b.d).not.toBe(obj.b.d)
  })

  it('should handle primitives', () => {
    expect(json(42)).toBe(42)
    expect(json('string')).toBe('string')
    expect(json(true)).toBe(true)
    expect(json(null)).toBe(null)
  })

  it('should handle arrays', () => {
    const arr = [1, { a: 2 }, [3, 4]]
    const cloned = json(arr)

    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
    expect(cloned[1]).not.toBe(arr[1])
  })

  it('should remove undefined values', () => {
    const obj = { a: 1, b: undefined, c: null }
    const result = json(obj)

    expect(result).toEqual({ a: 1, c: null })
    expect('b' in result).toBe(false)
  })
})
