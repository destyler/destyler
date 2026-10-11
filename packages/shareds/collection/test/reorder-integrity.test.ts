import { describe, expect, it } from 'vitest'
import { ListCollection } from '../src/list'

describe('collection reorder integrity', () => {
  it.each([3, 10, Number.POSITIVE_INFINITY])('does not insert a phantom item for missing source index %s', (from) => {
    const list = new ListCollection({ items: ['a', 'b', 'c'] })
    const items = list.items
    list.reorder(from, 1)
    expect(list.items).toBe(items)
    expect(list.items).toEqual(['a', 'b', 'c'])
    expect(list.size).toBe(3)
  })

  it('does not create an item in an empty collection', () => {
    const list = new ListCollection({ items: [] })
    list.reorder(0, 1)
    expect(list.items).toEqual([])
    expect(list.size).toBe(0)
  })

  it.each([undefined, 0, false, ''])('moves a genuinely present %j item', (item) => {
    const list = new ListCollection({ items: ['first', item, 'last'] })
    list.reorder(1, 0)
    expect(list.items).toEqual([item, 'first', 'last'])
    expect(list.size).toBe(3)
    expect(Object.hasOwn(list.items, 0)).toBe(true)
  })

  it('preserves caller arrays and item identity while mutating its own array', () => {
    const first = { value: 'first' }
    const second = { value: 'second' }
    const source = Object.freeze([first, second])
    const list = new ListCollection({ items: source })
    const items = list.items
    list.reorder(1, 0)
    expect(list.items).toBe(items)
    expect(list.items[0]).toBe(second)
    expect(list.items[1]).toBe(first)
    expect(source).toEqual([first, second])
  })

  it.each([
    { from: -2, to: 0, expected: ['c', 'a', 'b', 'd'] },
    { from: 3, to: -2, expected: ['a', 'd', 'b', 'c'] },
    { from: -10, to: 2, expected: ['b', 'c', 'a', 'd'] },
  ])('retains existing splice-style negative positions ($from → $to)', ({ from, to, expected }) => {
    const list = new ListCollection({ items: ['a', 'b', 'c', 'd'] })
    list.reorder(from, to)
    expect(list.items).toEqual(expected)
  })

  it.each([[-1, 1], [1, -1]])('keeps the existing missing-value sentinel (%s → %s)', (from, to) => {
    const list = new ListCollection({ items: ['a', 'b', 'c'] })
    list.reorder(from, to)
    expect(list.items).toEqual(['a', 'b', 'c'])
  })

  it('keeps overflow destinations appending the selected item', () => {
    const list = new ListCollection({ items: ['a', 'b', 'c'] })
    list.reorder(0, 10)
    expect(list.items).toEqual(['b', 'c', 'a'])
  })

  it('keeps equal positions unchanged', () => {
    const list = new ListCollection({ items: ['a', 'b', 'c'] })
    list.reorder(1, 1)
    expect(list.items).toEqual(['a', 'b', 'c'])
  })

  it('preserves permutations for all valid source and destination positions', () => {
    for (let size = 1; size <= 6; size++) {
      const source = Array.from({ length: size }, (_, index) => `item-${index}`)
      for (let from = 0; from < size; from++) {
        for (let to = 0; to < size; to++) {
          const expected = [...source]
          const [item] = expected.splice(from, 1)
          expected.splice(to, 0, item)
          const list = new ListCollection({ items: source })
          list.reorder(from, to)
          expect(list.items).toEqual(expected)
          expect(list.size).toBe(size)
          expect(new Set(list.items).size).toBe(size)
        }
      }
    }
  })
})
