import { afterEach, describe, expect, it, vi } from 'vitest'
import { getFocusables, getTabbables, isFocusable, isTabbable } from '../src/tabbable'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function fixture(tabIndex: number) {
  const root = document.createElement('div')
  const button = document.createElement('button')
  button.tabIndex = tabIndex
  button.textContent = 'target'
  button.style.cssText = 'width: 100px; height: 30px'
  root.append(button)
  document.body.append(root)
  return { root, button }
}

describe('tabbable eligibility', () => {
  it.each([0, 3])('excludes a native disabled button with tabindex=%s', (tabIndex) => {
    const { root, button } = fixture(tabIndex)
    button.disabled = true
    expect(isFocusable(button)).toBe(false)
    expect(isTabbable(button)).toBe(false)
    expect(getFocusables(root)).toEqual([])
    expect(getTabbables(root)).toEqual([])
  })

  it.each([0, 3])('excludes an inert descendant with tabindex=%s', (tabIndex) => {
    const { root, button } = fixture(tabIndex)
    root.setAttribute('inert', '')
    expect(isFocusable(button)).toBe(false)
    expect(isTabbable(button)).toBe(false)
    expect(getTabbables(root)).toEqual([])
  })

  it.each([0, 3])('excludes an unrendered button with tabindex=%s', (tabIndex) => {
    const { root, button } = fixture(tabIndex)
    button.style.display = 'none'
    expect(isFocusable(button)).toBe(false)
    expect(isTabbable(button)).toBe(false)
    expect(getTabbables(root)).toEqual([])
  })

  it.each([0, 3])('keeps an enabled rendered button eligible with tabindex=%s', (tabIndex) => {
    const { root, button } = fixture(tabIndex)
    expect(isFocusable(button)).toBe(true)
    expect(isTabbable(button)).toBe(true)
    expect(getFocusables(root)).toEqual([button])
    expect(getTabbables(root)).toEqual([button])
  })

  it('preserves programmatic focusability while excluding a negative tabindex from tab order', () => {
    const { root, button } = fixture(-1)
    expect(isFocusable(button)).toBe(true)
    expect(isTabbable(button)).toBe(false)
    expect(getFocusables(root)).toEqual([button])
    expect(getTabbables(root)).toEqual([])
  })
})
