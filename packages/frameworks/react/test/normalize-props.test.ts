import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/utils/normalize-props'

describe('react normalizeProps', () => {
  it('returns the same object reference for intrinsic props', () => {
    const props = {
      type: 'button',
      'data-scope': 'toolbar',
    } as any

    const normalized = normalizeProps.button(props)

    expect(normalized).toBe(props)
  })

  it('preserves style references and custom data attributes', () => {
    const style = { color: 'red' }
    const props = {
      style,
      'data-part': 'control',
    } as any

    const normalized = normalizeProps.element(props)

    expect(normalized).toBe(props)
    expect(normalized.style).toBe(style)
    expect(normalized['data-part']).toBe('control')
  })
})
