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
})
