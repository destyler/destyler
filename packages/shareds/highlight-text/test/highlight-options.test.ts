import type { HighlightWordProps } from '../index'
import { describe, expect, it } from 'vitest'
import { highlightWord } from '../index'

const first = [{ text: 'a', match: true }, { text: ' a b', match: false }]
const all = [
  { text: 'a', match: true },
  { text: ' ', match: false },
  { text: 'a', match: true },
  { text: ' b', match: false },
]
const multiple = [
  { text: 'a', match: true },
  { text: ' ', match: false },
  { text: 'a', match: true },
  { text: ' ', match: false },
  { text: 'b', match: true },
]

describe('highlightWord option ownership', () => {
  it('supports frozen options with the default first-match mode', () => {
    const props = Object.freeze({ text: 'a a b', query: 'a' })
    expect(highlightWord(props)).toEqual(first)
    expect(Object.hasOwn(props, 'matchAll')).toBe(false)
  })

  it('supports frozen options with the default multiple-query mode', () => {
    const props = Object.freeze({ text: 'a a b', query: ['a', 'b'] })
    expect(highlightWord(props)).toEqual(multiple)
    expect(Object.hasOwn(props, 'matchAll')).toBe(false)
  })

  it('does not add a default field to caller-owned mutable options', () => {
    const props = { text: 'a a b', query: 'a' }
    const before = Object.getOwnPropertyDescriptors(props)
    expect(highlightWord(props)).toEqual(first)
    expect(Object.getOwnPropertyDescriptors(props)).toEqual(before)
  })

  it('does not replace an explicitly undefined field', () => {
    const props = { text: 'a a b', query: ['a', 'b'], matchAll: undefined }
    const before = Object.getOwnPropertyDescriptors(props)
    expect(highlightWord(props)).toEqual(multiple)
    expect(Object.getOwnPropertyDescriptors(props)).toEqual(before)
  })

  it('supports a getter-only omitted mode without setting it', () => {
    const props = {
      text: 'a a b',
      query: ['a', 'b'],
      get matchAll(): undefined { return undefined },
    }
    const before = Object.getOwnPropertyDescriptors(props)
    expect(highlightWord(props)).toEqual(multiple)
    expect(Object.getOwnPropertyDescriptors(props)).toEqual(before)
  })

  it('recomputes the default when the same options change from string to array', () => {
    const props: HighlightWordProps = { text: 'a a b', query: 'a' }
    expect(highlightWord(props)).toEqual(first)
    props.query = ['a', 'b']
    expect(highlightWord(props)).toEqual(multiple)
    expect(Object.hasOwn(props, 'matchAll')).toBe(false)
  })

  it('recomputes the default when the same options change from array to string', () => {
    const props: HighlightWordProps = { text: 'a a b', query: ['a', 'b'] }
    expect(highlightWord(props)).toEqual(multiple)
    props.query = 'a'
    expect(highlightWord(props)).toEqual(first)
    expect(Object.hasOwn(props, 'matchAll')).toBe(false)
  })

  it('preserves explicit first and all modes on frozen options', () => {
    expect(highlightWord(Object.freeze({ text: 'a a b', query: 'a', matchAll: false }))).toEqual(first)
    expect(highlightWord(Object.freeze({ text: 'a a b', query: 'a', matchAll: true }))).toEqual(all)
  })

  it('preserves the multiple-query rejection when first-match mode is explicit', () => {
    const props = Object.freeze({ text: 'a a b', query: ['a', 'b'], matchAll: false })
    expect(() => highlightWord(props)).toThrow('matchAll must be true when using multiple queries')
  })

  it('preserves literal regex metacharacters and ignoreCase in multiple mode', () => {
    expect(highlightWord(Object.freeze({ text: 'A+B a+b [x]', query: ['a+b', '[x]'], ignoreCase: true }))).toEqual([
      { text: 'A+B', match: true },
      { text: ' ', match: false },
      { text: 'a+b', match: true },
      { text: ' ', match: false },
      { text: '[x]', match: true },
    ])
  })

  it('preserves empty query and absent match controls', () => {
    expect(highlightWord({ text: 'a a b', query: [] })).toEqual([{ text: 'a a b', match: false }])
    expect(highlightWord({ text: 'a a b', query: '', matchAll: true })).toEqual([{ text: 'a a b', match: false }])
    expect(highlightWord({ text: 'a a b', query: 'z' })).toEqual([{ text: 'a a b', match: false }])
  })

  it('does not enumerate unrelated caller fields when resolving multiple mode', () => {
    const props = {
      text: 'a a b',
      query: ['a', 'b'],
      get unrelated() { throw new Error('unrelated getter must not execute') },
    }
    expect(highlightWord(props)).toEqual(multiple)
  })

  it('preserves the existing JavaScript null default without rewriting it', () => {
    const props = { text: 'a a b', query: ['a', 'b'] }
    Object.defineProperty(props, 'matchAll', { value: null, writable: true, enumerable: true })
    const before = Object.getOwnPropertyDescriptors(props)
    expect(highlightWord(props)).toEqual(multiple)
    expect(Object.getOwnPropertyDescriptors(props)).toEqual(before)
  })
})
