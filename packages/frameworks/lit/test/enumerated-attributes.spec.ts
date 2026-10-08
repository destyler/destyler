import { html, nothing, render } from 'lit'
import { afterEach, describe, expect, it } from 'vitest'
import { spread } from '../src/directives/spread-props'
import { normalizeProps } from '../src/utils/normalize-props'

const cleanup: (() => void)[] = []
afterEach(() => cleanup.splice(0).reverse().forEach(fn => fn()))
function mount(initial: Record<string, unknown>) {
  const host = document.createElement('div')
  host.contentEditable = 'true'
  document.body.append(host)
  const view = (props: Record<string, unknown>) => html`<button ${spread(props)}></button>`
  const update = (props: Record<string, unknown>) => render(view(normalizeProps.element(props)), host)
  update(initial)
  cleanup.push(() => {
    render(nothing, host)
    host.remove()
  })
  return { element: host.querySelector('button')!, host, update }
}

describe('lit supported enumerated attributes', () => {
  it.each([false, 'false'] as const)('keeps %s contentEditable explicitly noneditable under an editable ancestor', (value) => {
    const input = Object.freeze({ contentEditable: value })
    const before = Object.getOwnPropertyDescriptors(input)
    const { element } = mount(input)
    expect(element.getAttribute('contenteditable')).toBe('false')
    expect(element.contentEditable).toBe('false')
    expect(element.isContentEditable).toBe(false)
    expect(Object.getOwnPropertyDescriptors(input)).toEqual(before)
  })
  it('preserves inherit instead of turning it into the empty true token', () => {
    const { element, host } = mount(Object.freeze({ contentEditable: 'inherit' }))
    expect(element.getAttribute('contenteditable')).toBe('inherit')
    expect(element.contentEditable).toBe('inherit')
    expect(element.isContentEditable).toBe(true)
    host.contentEditable = 'false'
    expect(element.isContentEditable).toBe(false)
  })
  it('updates false→true→string false and clears explicit undefined without mutating inputs', () => {
    const { element, update } = mount({})
    for (const value of [false, true, 'false', 'true', undefined, false] as const) {
      const input = Object.freeze({ contentEditable: value })
      const before = Object.getOwnPropertyDescriptors(input)
      update(input)
      expect(element.getAttribute('contenteditable')).toBe(value === undefined ? null : String(value))
      expect(element.isContentEditable).toBe(value !== false && value !== 'false')
      expect(Object.getOwnPropertyDescriptors(input)).toEqual(before)
    }
    update(Object.freeze({ contentEditable: undefined }))
    expect(element.hasAttribute('contenteditable')).toBe(false)
    expect(element.isContentEditable).toBe(true)
  })
  it.each(['draggable', 'spellCheck'] as const)('%s remains an explicit Booleanish string-valued control', (key) => {
    const { element, update } = mount({})
    for (const value of [false, true, 'false', 'true', undefined] as const) {
      const input = Object.freeze({ [key]: value })
      update(input)
      expect(element.getAttribute(key.toLowerCase())).toBe(value === undefined ? null : String(value))
      expect(input[key]).toBe(value)
    }
    update({})
    expect(element.hasAttribute(key.toLowerCase())).toBe(false)
  })
  it('keeps true-boolean disabled and string translate controls distinct', () => {
    const { element, update } = mount(Object.freeze({ disabled: true, translate: 'no' }))
    expect(element.disabled).toBe(true)
    expect(element.getAttribute('disabled')).toBe('')
    expect(element.getAttribute('translate')).toBe('no')
    update(Object.freeze({ disabled: false, translate: 'yes' }))
    expect(element.disabled).toBe(false)
    expect(element.hasAttribute('disabled')).toBe(false)
    expect(element.getAttribute('translate')).toBe('yes')
    update({ translate: undefined })
    expect(element.hasAttribute('disabled')).toBe(false)
    expect(element.hasAttribute('translate')).toBe(false)
  })
})
