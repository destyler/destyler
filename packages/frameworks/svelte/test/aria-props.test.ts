import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/utils/normalize-props'

describe('svelte explicit ARIA state', () => {
  it.each([true, false])('serializes explicit %s ARIA and data values while preserving native boolean semantics', (value) => {
    const props = normalizeProps.button({ 'aria-expanded': value, 'aria-disabled': value, 'data-active': value, 'disabled': value })
    expect(props['aria-expanded']).toBe(String(value))
    expect(props['aria-disabled']).toBe(String(value))
    expect(props['data-active']).toBe(String(value))
    expect(props.disabled).toBe(value ? true : undefined)
  })

  it('keeps missing and string-valued ARIA state unchanged', () => {
    const props = normalizeProps.button({ 'aria-pressed': 'mixed', 'aria-expanded': undefined, 'data-active': 'false' })
    expect(props['aria-pressed']).toBe('mixed')
    expect(props['aria-expanded']).toBeUndefined()
    expect(props['data-active']).toBe('false')
  })
})
