import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { off, on } from '../../src'

describe('trap', () => {
  let outer: HTMLDivElement
  let inner: HTMLDivElement
  beforeEach(() => {
    document.body.innerHTML = '<div id="outer"><div id="inner"></div></div>'
    outer = document.getElementById('outer') as HTMLDivElement
    inner = document.getElementById('inner') as HTMLDivElement
  })
  afterEach(() => {
    document.body.innerHTML = ''
    outer = null as any
    inner = null as any
  })
  describe('mousemoveoutside', () => {
    it('works', () => {
      const fn = vi.fn()
      on('mousemoveoutside', inner, fn)
      outer.dispatchEvent(new Event('mousemove', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
      inner.dispatchEvent(new Event('mousemove', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
      off('mousemoveoutside', inner, fn)
      outer.dispatchEvent(new Event('mousemove', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
  describe('clickoutside', () => {
    it('works', () => {
      const fn = vi.fn()
      on('clickoutside', inner, fn)
      outer.dispatchEvent(new Event('mousedown', { bubbles: true }))
      outer.dispatchEvent(new Event('mouseup', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
      inner.dispatchEvent(new Event('mousedown', { bubbles: true }))
      inner.dispatchEvent(new Event('mouseup', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
      off('clickoutside', inner, fn)
      outer.dispatchEvent(new Event('mousedown', { bubbles: true }))
      outer.dispatchEvent(new Event('mouseup', { bubbles: true }))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })
})
