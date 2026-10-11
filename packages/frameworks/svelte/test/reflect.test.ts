import { describe, expect, it } from 'vitest'
import { reflect } from '../src/utils/reflect'

describe('svelte immutable snapshot reflection', () => {
  it('reads updated nested context when the initial snapshot is frozen', () => {
    let current: Readonly<{ value: string, context: Readonly<{ count: number }> }> = Object.freeze({ value: 'idle', context: Object.freeze({ count: 0 }) })
    const state = reflect(() => current)
    expect(state.context.count).toBe(0)

    current = Object.freeze({ value: 'active', context: Object.freeze({ count: 1 }) })
    expect(state.value).toBe('active')
    expect(state.context.count).toBe(1)
    expect(Object.keys(state)).toEqual(['value', 'context'])
  })

  it('binds methods to the latest frozen snapshot', () => {
    let current: Readonly<{ value: number, read: () => number }> = Object.freeze({
      value: 1,
      read(this: { value: number }) { return this.value },
    })
    const state = reflect(() => current)
    const readFirst = state.read
    expect(readFirst()).toBe(1)

    current = Object.freeze({
      value: 2,
      read(this: { value: number }) { return this.value },
    })
    const readNext = state.read
    expect(readNext()).toBe(2)
    expect(readFirst()).toBe(1)
  })
})
