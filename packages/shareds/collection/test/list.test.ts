import { beforeEach, describe, expect, it } from 'vitest'
import { ListCollection } from '../index'

interface Item {
  label: string
  value: string
  disabled?: boolean
}

const items: Item[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid', disabled: true },
  { label: 'Angular', value: 'angular' },
]

let list: ListCollection

beforeEach(() => {
  list = new ListCollection({
    items,
    itemToString: item => item.label,
    itemToValue: item => item.value,
    isItemDisabled: item => !!item.disabled,
  })
})

describe('list collection', () => {
  it('get values', () => {
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "vue",
        "solid",
        "angular",
      ]
    `)
  })

  it('count', () => {
    expect(list.size).toMatchInlineSnapshot(`4`)
  })

  it('next item', () => {
    expect(list.getNextValue('react')).toMatchInlineSnapshot(`"vue"`)
    expect(list.getNextValue('angular')).toMatchInlineSnapshot(`null`)
  })

  it('prev item', () => {
    expect(list.getPreviousValue('solid')).toMatchInlineSnapshot(`"vue"`)
    expect(list.getPreviousValue('react')).toMatchInlineSnapshot(`null`)
  })

  it('set items', () => {
    list.setItems([
      { label: 'Svelte', value: 'svelte' },
      { label: 'Node.js', value: 'node' },
    ])
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "svelte",
        "node",
      ]
    `)
  })

  it('get value at index', () => {
    expect(list.at(1)).toMatchInlineSnapshot(`
      {
        "label": "Vue",
        "value": "vue",
      }
    `)
    expect(list.at(5)).toMatchInlineSnapshot(`null`)
  })

  it('sort', () => {
    expect(list.sort(['solid', 'vue'])).toMatchInlineSnapshot(`
      [
        "vue",
        "solid",
      ]
    `)
  })

  it('item to value', () => {
    expect(list.getItemValue(items[0])).toMatchInlineSnapshot(`"react"`)
    expect(list.getItemValue(items[2])).toMatchInlineSnapshot(`"solid"`)
  })

  it('item to string', () => {
    expect(list.stringifyItem(items[0])).toMatchInlineSnapshot(`"React"`)
  })

  it('items to string', () => {
    expect(list.stringifyItems([items[0], items[3]])).toMatchInlineSnapshot(`"React, Angular"`)
  })

  it('item to disabled', () => {
    expect(list.getItemDisabled(items[0])).toMatchInlineSnapshot(`false`)
    expect(list.getItemDisabled(items[2])).toMatchInlineSnapshot(`true`)
  })

  it('first and last value', () => {
    expect(list.firstValue).toMatchInlineSnapshot(`"react"`)
    expect(list.lastValue).toMatchInlineSnapshot(`"angular"`)
  })

  it('has value', () => {
    expect(list.has('react')).toMatchInlineSnapshot(`true`)
    expect(list.has('<random>')).toMatchInlineSnapshot(`false`)
  })

  it('search finds a value based on a query', () => {
    const options = { state: { keysSoFar: '', timer: -1 }, currentValue: null, timeout: 350 }
    expect(list.search('r', options)).toMatchInlineSnapshot(`"react"`)
  })

  it('insert before / valid', () => {
    list.insertBefore('react', { label: 'Svelte', value: 'svelte' })
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "svelte",
        "react",
        "vue",
        "solid",
        "angular",
      ]
    `)
  })

  it('insert before / invalid', () => {
    list.insertBefore('<random>', { label: 'Svelte', value: 'svelte' })
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "vue",
        "solid",
        "angular",
      ]
    `)
  })

  it('insert after / valid', () => {
    list.insertAfter('solid', { label: 'Svelte', value: 'svelte' })
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "vue",
        "solid",
        "svelte",
        "angular",
      ]
    `)
  })

  it('insert after / invalid', () => {
    list.insertAfter('<random>', { label: 'Svelte', value: 'svelte' })
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "vue",
        "solid",
        "angular",
      ]
    `)
  })

  it('reorder / valid', () => {
    list.reorder(2, 1)
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "solid",
        "vue",
        "angular",
      ]
    `)
  })

  it('reorder / invalid', () => {
    list.reorder(2, 5)
    expect(list.getValues()).toMatchInlineSnapshot(`
      [
        "react",
        "vue",
        "angular",
        "solid",
      ]
    `)
  })

  describe('edge cases', () => {
    it('should handle empty collection', () => {
      const emptyList = new ListCollection({ items: [] })
      expect(emptyList.size).toBe(0)
      expect(emptyList.firstValue).toBe(null)
      expect(emptyList.lastValue).toBe(null)
      expect(emptyList.getValues()).toEqual([])
      expect(emptyList.find('anything')).toBe(null)
    })

    it('should handle null and undefined values', () => {
      expect(list.find(null)).toBe(null)
      expect(list.find(undefined)).toBe(null)
      expect(list.getItemValue(null)).toBe(null)
      expect(list.getItemValue(undefined)).toBe(null)
      expect(list.stringifyItem(null)).toBe(null)
      expect(list.stringify(null)).toBe(null)
    })

    it('should handle collection with all disabled items', () => {
      const disabledList = new ListCollection({
        items: [
          { label: 'Disabled 1', value: 'disabled1', disabled: true },
          { label: 'Disabled 2', value: 'disabled2', disabled: true },
        ],
        itemToString: item => item.label,
        itemToValue: item => item.value,
        isItemDisabled: item => !!item.disabled,
      })
      expect(disabledList.firstValue).toBe(null)
      expect(disabledList.lastValue).toBe(null)
    })
  })

  describe('findMany', () => {
    it('should find multiple items by values', () => {
      const found = list.findMany(['react', 'angular'])
      expect(found).toHaveLength(2)
      expect(found[0].value).toBe('react')
      expect(found[1].value).toBe('angular')
    })

    it('should filter out non-existent values', () => {
      const found = list.findMany(['react', 'nonexistent', 'vue'])
      expect(found).toHaveLength(2)
      expect(found.map(item => item.value)).toEqual(['react', 'vue'])
    })

    it('should handle empty array', () => {
      expect(list.findMany([])).toEqual([])
    })
  })

  describe('stringifyMany', () => {
    it('should stringify multiple values with default separator', () => {
      expect(list.stringifyMany(['react', 'vue'])).toBe('React, Vue')
    })

    it('should stringify multiple values with custom separator', () => {
      expect(list.stringifyMany(['react', 'vue'], ' | ')).toBe('React | Vue')
    })

    it('should handle empty array', () => {
      expect(list.stringifyMany([])).toBe('')
    })
  })

  describe('indexOf', () => {
    it('should return correct index for existing value', () => {
      expect(list.indexOf('vue')).toBe(1)
      expect(list.indexOf('angular')).toBe(3)
    })

    it('should return -1 for non-existent value', () => {
      expect(list.indexOf('nonexistent')).toBe(-1)
    })

    it('should return -1 for null', () => {
      expect(list.indexOf(null)).toBe(-1)
    })
  })

  describe('hasItem', () => {
    it('should return true for existing item', () => {
      expect(list.hasItem(items[0])).toBe(true)
    })

    it('should return false for non-existent item', () => {
      const nonExistentItem = { label: 'Svelte', value: 'svelte' }
      expect(list.hasItem(nonExistentItem)).toBe(false)
    })

    it('should return false for null', () => {
      expect(list.hasItem(null)).toBe(false)
    })
  })

  describe('navigation with disabled items', () => {
    it('should skip disabled items when getting next value', () => {
      expect(list.getNextValue('vue')).toBe('angular') // skips disabled 'solid'
    })

    it('should skip disabled items when getting previous value', () => {
      expect(list.getPreviousValue('angular')).toBe('vue') // skips disabled 'solid'
    })

    it('should handle navigation with clamp option', () => {
      expect(list.getNextValue('angular', 1, true)).toBe('angular') // clamped to last
      expect(list.getPreviousValue('react', 1, true)).toBe('react') // clamped to first
    })

    it('should handle large steps', () => {
      expect(list.getNextValue('react', 3)).toBe('angular')
      expect(list.getPreviousValue('angular', 3)).toBe('react')
    })
  })

  describe('search functionality', () => {
    it('should find item with single character', () => {
      const state = { keysSoFar: '', timer: -1 }
      expect(list.search('v', { state, currentValue: null })).toBe('vue')
    })

    it('should find item with multiple characters', () => {
      const state = { keysSoFar: '', timer: -1 }
      expect(list.search('an', { state, currentValue: null })).toBe('angular')
    })

    it('should handle repeated characters', () => {
      const state = { keysSoFar: '', timer: -1 }
      // Create a list with multiple items starting with 'r' to test repeated character search
      const testList = new ListCollection({
        items: [
          { label: 'React', value: 'react' },
          { label: 'Redux', value: 'redux' },
          { label: 'Vue', value: 'vue' },
          { label: 'Ruby', value: 'ruby' },
        ],
        itemToString: item => item.label,
        itemToValue: item => item.value,
      })

      // When searching 'r' from 'react', it should find the next item starting with 'r'
      expect(testList.search('r', { state, currentValue: 'react' })).toBe('redux')

      // For the original list where only 'react' starts with 'r', it should return null
      expect(list.search('r', { state: { keysSoFar: '', timer: -1 }, currentValue: 'react' })).toBe(null)
    })

    it('should handle case insensitive search', () => {
      const state = { keysSoFar: '', timer: -1 }
      expect(list.search('REACT', { state, currentValue: null })).toBe('react')
    })

    it('should return null for non-matching search', () => {
      const state = { keysSoFar: '', timer: -1 }
      expect(list.search('xyz', { state, currentValue: null })).toBe(null)
    })
  })

  describe('isEqual', () => {
    it('should return true for collections with same items', () => {
      const otherList = new ListCollection({ items })
      expect(list.isEqual(otherList)).toBe(true)
    })

    it('should return false for collections with different items', () => {
      const otherList = new ListCollection({
        items: [{ label: 'Svelte', value: 'svelte' }],
      })
      expect(list.isEqual(otherList)).toBe(false)
    })
  })

  describe('iterator', () => {
    it('should be iterable', () => {
      const values = []
      for (const item of list) {
        values.push(item.value)
      }
      expect(values).toEqual(['react', 'vue', 'solid', 'angular'])
    })

    it('should work with spread operator', () => {
      const itemsArray = [...list]
      expect(itemsArray).toHaveLength(4)
      expect(itemsArray).toEqual(items)
    })
  })

  describe('json serialization', () => {
    it('should return collection summary', () => {
      expect(list.json()).toEqual({
        size: 4,
        first: 'react',
        last: 'angular',
      })
    })

    it('should handle empty collection', () => {
      const emptyList = new ListCollection({ items: [] })
      expect(emptyList.json()).toEqual({
        size: 0,
        first: null,
        last: null,
      })
    })
  })

  describe('reorder edge cases', () => {
    it('should handle same index reorder', () => {
      const originalValues = list.getValues()
      list.reorder(1, 1)
      expect(list.getValues()).toEqual(originalValues)
    })

    it('should handle invalid from index', () => {
      const originalValues = list.getValues()
      list.reorder(-1, 1)
      expect(list.getValues()).toEqual(originalValues)
    })

    it('should handle invalid to index', () => {
      const originalValues = list.getValues()
      list.reorder(1, -1)
      expect(list.getValues()).toEqual(originalValues)
    })

    it('should move item to end when toIndex is beyond array length', () => {
      list.reorder(0, 10) // move 'react' to end
      expect(list.getValues()).toEqual(['vue', 'solid', 'angular', 'react'])
    })
  })

  describe('fallback behavior', () => {
    it('should use fallback methods when no options provided', () => {
      const stringList = new ListCollection({ items: ['react', 'vue', 'angular'] })
      expect(stringList.getItemValue('react')).toBe('react')
      expect(stringList.stringifyItem('vue')).toBe('vue')
      expect(stringList.getItemDisabled('angular')).toBe(false)
    })

    it('should handle object items without custom methods', () => {
      const objectList = new ListCollection({
        items: [
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
        ],
      })
      expect(objectList.getItemValue({ value: 'react', label: 'React' })).toBe('react')
      expect(objectList.stringifyItem({ value: 'vue', label: 'Vue' })).toBe('Vue')
    })
  })
})
