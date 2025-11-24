import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/utils/normalize-props'

describe('svelte normalizeProps', () => {
  it('maps camelCase props to their Svelte equivalents while preserving reserved keys', () => {
    const normalized = normalizeProps.label({
      className: 'control',
      htmlFor: 'input-id',
    } as any)

    expect(normalized.class).toBe('control')
    expect(normalized.for).toBe('input-id')

    const svgNormalized = normalizeProps.svg({
      viewBox: '0 0 24 24',
    } as any)

    expect(svgNormalized.viewBox).toBe('0 0 24 24')
  })

  it('stringifies style objects and kebab-cases property names', () => {
    const normalized = normalizeProps.button({
      style: {
        'backgroundColor': 'black',
        '--gap': '0.25rem',
      },
    } as any)

    expect(normalized.style).toBe('background-color:black;--gap:0.25rem;')
  })

  it('translates defaultChecked/defaultValue and drops explicit falsey booleans', () => {
    const normalized = normalizeProps.input({
      defaultChecked: true,
      disabled: false,
    } as any)

    expect(normalized.checked).toBe(true)
    expect(normalized.disabled).toBeUndefined()
  })
})
