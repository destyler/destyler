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

  describe.each(['checked', 'defaultChecked'] as const)('%s boolean attribute', (key) => {
    it.each([false, true, undefined, null])('normalizes %s without mutating props', (value) => {
      const props = Object.freeze({ [key]: value })
      const normalized = normalizeProps.input(props)

      expect(normalized).toEqual({ checked: value ? '' : undefined })
      expect(props[key]).toBe(value)
    })
  })

  it('preserves nonboolean attributes and other aliases beside defaultChecked', () => {
    const onChange = () => {}
    const onClick = () => {}
    const props = Object.freeze({
      'defaultChecked': false,
      'defaultValue': 'false',
      'aria-checked': false,
      'data-active': false,
      'title': 'checkbox',
      onChange,
      onClick,
    })

    expect(normalizeProps.input(props)).toEqual({
      'checked': undefined,
      'value': 'false',
      'aria-checked': false,
      'data-active': false,
      'title': 'checkbox',
      '@input': onChange,
      '@click': onClick,
    })
    expect(props.defaultChecked).toBe(false)
    expect(props.defaultValue).toBe('false')
  })

  it('moves string children into textContent placeholders', () => {
    const normalized = normalizeProps.span({
      children: 'Lit Portal',
    } as any)

    expect(normalized.textContent).toBe('Lit Portal')
    expect(normalized.children).toBeUndefined()
  })
})
