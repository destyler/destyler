import { describe, expect, it } from 'vitest'
import { normalizeProps } from '../src/normalize-props'
import { spread } from '../src/spread'
import { spreadProps } from '../src/spread-props'

describe('vanilla explicit ARIA state', () => {
  it.each([true, false])('serializes %s ARIA/data values as strings in markup', (value) => {
    const root = document.createElement('div')
    root.innerHTML = `<button ${spread({ 'aria-expanded': value, 'data-active': value, 'disabled': value })}></button>`
    const button = root.querySelector('button')!
    expect(button.getAttribute('aria-expanded')).toBe(String(value))
    expect(button.getAttribute('data-active')).toBe(String(value))
    expect(button.disabled).toBe(value)
  })

  it('updates explicit ARIA/data booleans and only removes absent values', () => {
    const button = document.createElement('button')
    for (const value of [true, false]) {
      spreadProps(button, normalizeProps.button({ 'aria-expanded': value, 'data-active': value, 'disabled': value }))
      expect(button.getAttribute('aria-expanded')).toBe(String(value))
      expect(button.getAttribute('data-active')).toBe(String(value))
      expect(button.disabled).toBe(value)
    }
    spreadProps(button, { 'aria-expanded': undefined, 'data-active': null })
    expect(button.hasAttribute('aria-expanded')).toBe(false)
    expect(button.hasAttribute('data-active')).toBe(false)
  })
})
