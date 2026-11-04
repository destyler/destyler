import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/shared/normalize-props'

describe('vue normalizeProps', () => {
  it('moves textual children into textContent', () => {
    const normalized = normalizeProps.span({
      children: 'Vue Portal',
    } as any)

    // @ts-expect-error textContent is not defined on HTMLSpanElement
    expect(normalized.textContent).toBe('Vue Portal')
    // @ts-expect-error children is not defined on HTMLSpanElement
    expect(normalized.children).toBeUndefined()
  })

  it('maps DOM attributes to Vue-friendly names', () => {
    const focusHandler = () => {}
    const normalized = normalizeProps.label({
      htmlFor: 'input-id',
      onFocus: focusHandler,
    } as any)

    expect(normalized.for).toBe('input-id')
    expect(normalized.onFocusin).toBe(focusHandler)
  })

  it('transforms events outside the prop map using Vue casing and rewrites default form props', () => {
    const keydown = () => {}
    const normalized = normalizeProps.input({
      onKeyDown: keydown,
      defaultValue: 'hello',
    } as any)

    expect(normalized.onKeydown).toBe(keydown)
    expect(normalized.value).toBe('hello')
  })

  it.each([
    'viewBox',
    'preserveAspectRatio',
    'gradientUnits',
    'gradientTransform',
    'patternUnits',
    'patternContentUnits',
    'clipPathUnits',
    'maskContentUnits',
    'markerWidth',
    'markerHeight',
    'refX',
    'pathLength',
    'textLength',
    'attributeName',
    'stdDeviation',
    'baseFrequency',
    'xChannelSelector',
  ])('preserves the case-sensitive SVG attribute %s', (key) => {
    expect(normalizeProps.svg({ [key]: 'value' })).toEqual({ [key]: 'value' })
  })

  it.each([
    ['strokeWidth', 'stroke-width'],
    ['strokeLinecap', 'stroke-linecap'],
    ['strokeDasharray', 'stroke-dasharray'],
    ['fillRule', 'fill-rule'],
    ['clipPath', 'clip-path'],
    ['clipRule', 'clip-rule'],
    ['stopColor', 'stop-color'],
    ['fontSize', 'font-size'],
    ['vectorEffect', 'vector-effect'],
    ['xlinkHref', 'xlink:href'],
    ['xmlSpace', 'xml:space'],
    ['xmlnsXlink', 'xmlns:xlink'],
    ['panose1', 'panose-1'],
  ])('maps the SVG alias %s to %s', (key, attribute) => {
    expect(normalizeProps.path({ [key]: 'value' })).toEqual({ [attribute]: 'value' })
  })

  it('leaves native SVG attribute spellings and style objects intact', () => {
    const style = { 'strokeWidth': 2, '--custom-size': '10px' }
    expect(normalizeProps.svg({
      'viewBox': '0 0 100 100',
      'stroke-width': 2,
      'xlink:href': '#symbol',
      style,
    } as any)).toEqual({
      'viewBox': '0 0 100 100',
      'stroke-width': 2,
      'xlink:href': '#symbol',
      style,
    })
  })

  it('retains HTML, data, ARIA, and default boolean normalization', () => {
    expect(normalizeProps.input({
      'tabIndex': 0,
      'readOnly': true,
      'autoComplete': 'off',
      'defaultChecked': false,
      'data-state': 'checked',
      'aria-checked': false,
    })).toEqual({
      'tabindex': 0,
      'readonly': true,
      'autocomplete': 'off',
      'checked': false,
      'data-state': 'checked',
      'aria-checked': false,
    })
  })
})
