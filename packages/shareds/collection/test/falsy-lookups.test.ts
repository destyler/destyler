import { describe, expect, it } from 'vitest'
import { ListCollection } from '../src/list'

describe('generic collection lookup results', () => {
  it.each([0, false, ''])('retains the valid item %j with a nonempty custom value', (item) => {
    const list = new ListCollection({
      items: [item, 'tail'],
      itemToValue: value => JSON.stringify(value),
      itemToString: value => `Label:${String(value)}`,
    })
    const value = JSON.stringify(item)

    expect(list.find(value)).toBe(item)
    expect(list.findMany([value, 'missing', '"tail"', value])).toEqual([item, 'tail', item])
    expect(list.stringifyMany([value, '"tail"'], ' | ')).toBe(`Label:${String(item)} | Label:tail`)
  })

  it('round-trips all mapped values without dropping falsy items', () => {
    const list = new ListCollection({
      items: [0, false, '', 1],
      itemToValue: value => JSON.stringify(value),
    })
    expect(list.findMany(list.getValues())).toEqual(list.items)
  })

  it('filters only missing results while preserving order and duplicates', () => {
    const list = new ListCollection({ items: ['first', 'second'] })
    expect(list.findMany(['second', 'missing', 'first', 'second'])).toEqual(['second', 'first', 'second'])
    expect(list.findMany(['missing'])).toEqual([])
    expect(list.findMany([])).toEqual([])
  })

  it('keeps nullish source items distinct from mapped falsy items', () => {
    const list = new ListCollection({
      items: [null, 0, undefined, 1],
      itemToValue: value => `value:${value}`,
    })
    expect(list.getValues()).toEqual(['value:0', 'value:1'])
    expect(list.findMany(['value:0', 'value:null', 'value:1', 'value:undefined'])).toEqual([0, 1])
  })

  it('preserves item identity without mutating query or collection arrays', () => {
    const first = { value: 'first' }
    const second = { value: 'second' }
    const source = [first, second]
    const query = ['second', 'first']
    const list = new ListCollection({ items: source })
    const found = list.findMany(query)

    expect(found[0]).toBe(second)
    expect(found[1]).toBe(first)
    found.pop()
    expect(query).toEqual(['second', 'first'])
    expect(list.items).toEqual([first, second])
    expect(source).toEqual([first, second])
  })
})
