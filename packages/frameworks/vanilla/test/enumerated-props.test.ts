import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/normalize-props'
import { spread } from '../src/spread'

describe('vanilla enumerated server markup', () => {
  it.each(['contentEditable', 'draggable', 'spellCheck'] as const)('serializes Booleanish %s without treating it as a presence-only boolean', (key) => {
    expect(typeof document).toBe('undefined')
    for (const value of [false, true, 'false', 'true'] as const) {
      const input = Object.freeze({ [key]: value })
      const attrs = spread(normalizeProps.element(input))
      expect(attrs).toBe(`${key.toLowerCase()}="${String(value)}"`)
      expect(input[key]).toBe(value)
    }
    expect(spread(normalizeProps.element({ [key]: undefined }))).toBe('')
  })

  it('preserves inherit/translate tokens and true boolean omission/presence', () => {
    expect(spread(normalizeProps.element({ contentEditable: 'inherit', translate: 'no' }))).toBe('contenteditable="inherit" translate="no"')
    expect(spread(normalizeProps.button({ disabled: true }))).toBe('disabled')
    expect(spread(normalizeProps.button({ disabled: false }))).toBe('')
  })
})
