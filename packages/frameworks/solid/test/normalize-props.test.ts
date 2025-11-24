import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/utils/normalize-props'

describe('solid normalizeProps', () => {
  it('hyphenates style keys but keeps CSS custom properties intact', () => {
    const normalized = normalizeProps.button({
      style: {
        backgroundColor: 'rebeccapurple',
        '--gap': '4px',
      },
    } as any)

    expect(normalized.style).toEqual({
      'background-color': 'rebeccapurple',
      '--gap': '4px',
    })
  })

  it('maps DOM events and default values to Solid equivalents', () => {
    const handler = () => {}
    const normalized = normalizeProps.input({
      onChange: handler,
      defaultValue: 'hello',
    } as any)

    expect(normalized.onInput).toBe(handler)
    expect(normalized.value).toBe('hello')
  })

  it('moves string children into textContent', () => {
    const normalized = normalizeProps.span({
      children: 'Destyler',
    } as any)

    expect(normalized.textContent).toBe('Destyler')
    expect(normalized.children).toBeUndefined()
  })

  it('omits readOnly when explicitly set to false', () => {
    const normalized = normalizeProps.input({
      readOnly: false,
    } as any)

    expect('readOnly' in normalized).toBe(false)
  })
})
