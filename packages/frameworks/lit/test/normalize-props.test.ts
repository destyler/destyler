import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/utils/normalize-props'

describe('lit normalizeProps', () => {
  it('stringifies style objects with kebab-case keys', () => {
    const normalized = normalizeProps.button({
      style: {
        'backgroundColor': 'purple',
        '--gap': '8px',
      },
    } as any)

    expect(normalized.style).toBe('background-color:purple;--gap:8px;')
  })

  it('maps events to Lit directive syntax and normalizes boolean attributes', () => {
    const onFocus = () => {}
    const normalized = normalizeProps.button({
      onFocus,
      disabled: true,
    } as any)

    expect(normalized['@focusin']).toBe(onFocus)
    expect(normalized.disabled).toBe('')

    const normalizedFalse = normalizeProps.button({
      disabled: false,
    } as any)

    expect(normalizedFalse.disabled).toBeUndefined()
  })

  it('moves string children into textContent placeholders', () => {
    const normalized = normalizeProps.span({
      children: 'Lit Portal',
    } as any)

    expect(normalized.textContent).toBe('Lit Portal')
    expect(normalized.children).toBeUndefined()
  })
})
