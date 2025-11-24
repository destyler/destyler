import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/normalize-props'

describe('normalizeProps', () => {
  it('preserves defaultValue props for uncontrolled inputs', () => {
    const normalized = normalizeProps.input({ defaultValue: 'hello', type: 'text' })

    expect(normalized.defaultValue).toBe('hello')
    expect(normalized.value).toBeUndefined()
  })

  it('preserves defaultChecked props for uncontrolled inputs', () => {
    const normalized = normalizeProps.input({ defaultChecked: true, type: 'checkbox' })

    expect(normalized.defaultChecked).toBe(true)
    expect(normalized.checked).toBeUndefined()
  })

  it('normalizes readOnly without stringifying', () => {
    const normalized = normalizeProps.input({ readOnly: false })

    expect(normalized.readonly).toBe(false)
  })

  it('stringifies style objects using kebab-case keys', () => {
    const normalized = normalizeProps.button({ style: { 'backgroundColor': 'black', '--gap': '2px' } })

    expect(normalized.style).toBe('background-color:black;--gap:2px;')
  })

  it('maps DOM props to lower-case or explicit aliases', () => {
    const normalized = normalizeProps.label({
      onChange: () => {},
      htmlFor: 'input-id',
    })

    expect(typeof normalized.oninput).toBe('function')
    expect(normalized.for).toBe('input-id')
  })
})
