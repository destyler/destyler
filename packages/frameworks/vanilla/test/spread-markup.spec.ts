import { describe, expect, it } from 'vitest'
import { spread } from '../src/spread'
import { toStyleString } from '../src/utils/style'

describe('vanilla spread markup values', () => {
  it.each(['literal &copy;', 'already &amp; encoded', 'a "quote" <inside> & text'])('preserves the literal attribute value %s', (value) => {
    const root = document.createElement('div')
    root.innerHTML = `<span ${spread({ title: value })}></span>`
    expect(root.firstElementChild?.getAttribute('title')).toBe(value)
    expect(root.firstElementChild?.attributes.length).toBe(1)
  })

  it('keeps quoted style values inside their attribute', () => {
    const root = document.createElement('div')
    const style = { fontFamily: '"Open Sans", sans-serif', content: '"hello & goodbye"', '--encoded': '&quot;' }
    root.innerHTML = `<span ${spread({ style })}></span>`
    expect(root.firstElementChild?.getAttribute('style')).toBe(toStyleString(style))
    expect(root.firstElementChild?.attributes.length).toBe(1)
  })

  it('escapes string style values without decoding their existing entity text', () => {
    const root = document.createElement('div')
    const style = 'font-family:"Open Sans";--encoded:&quot;;'
    root.innerHTML = `<span ${spread({ style })}></span>`
    expect(root.firstElementChild?.getAttribute('style')).toBe(style)
  })

  it('keeps native boolean, empty, numeric and omitted-value behavior', () => {
    const root = document.createElement('div')
    root.innerHTML = `<input ${spread({ disabled: true, required: false, title: '', tabindex: 0, hidden: null, onclick: () => {} })}>`
    const input = root.querySelector('input')!
    expect(input.disabled).toBe(true)
    expect(input.required).toBe(false)
    expect(input.getAttribute('title')).toBe('')
    expect(input.tabIndex).toBe(0)
    expect(input.hasAttribute('hidden')).toBe(false)
    expect(input.hasAttribute('onclick')).toBe(false)
  })
})
