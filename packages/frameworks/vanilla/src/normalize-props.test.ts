import { describe, expect, it } from 'vitest'
import { normalizeProps } from './normalize-props'

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
})
