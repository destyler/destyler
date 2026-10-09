import { afterEach, describe, expect, it } from 'vitest'
import { connect as colorConnect } from '../../../components/color-picker/src/connect'
import { machine as colorMachine } from '../../../components/color-picker/src/machine'
import { connect as numberConnect } from '../../../components/number-input/src/connect'
import { machine as numberMachine } from '../../../components/number-input/src/machine'
import { normalizeProps } from '../src/normalize-props'
import { spread } from '../src/spread'
import { hydrateSpreadProps, spreadProps } from '../src/spread-props'

const modes = ['dom', 'hydrate', 'markup'] as const
const roots: HTMLElement[] = []
afterEach(() => roots.splice(0).forEach(root => root.remove()))

function mount(mode: typeof modes[number], props: Record<string, unknown>, tag = 'div') {
  const parent = document.createElement('div')
  parent.contentEditable = 'true'
  parent.setAttribute('spellcheck', 'true')
  parent.setAttribute('translate', 'yes')
  document.body.append(parent)
  roots.push(parent)
  if (mode === 'markup' || mode === 'hydrate') {
    const attrs = mode === 'markup' ? spread(props) : spreadProps(props)
    parent.innerHTML = `<${tag} ${attrs}></${tag}>`
  }
  else {
    parent.append(document.createElement(tag))
  }
  const element = parent.firstElementChild as HTMLElement
  if (mode === 'hydrate')
    hydrateSpreadProps(parent)
  else if (mode === 'dom')
    spreadProps(element, props)
  expect(parent.firstElementChild).toBe(element)
  expect(element.hasAttribute('data-destyler-spread')).toBe(false)
  return { element, parent }
}

describe('vanilla contentEditable semantics', () => {
  it.each(modes)('keeps a false contentEditable island under an editable ancestor (%s)', (mode) => {
    for (const value of [false, 'false'] as const) {
      const input = Object.freeze({ contentEditable: value })
      const { element, parent } = mount(mode, normalizeProps.element(input))
      expect(parent.isContentEditable).toBe(true)
      expect(element.contentEditable).toBe('false')
      expect(element.isContentEditable).toBe(false)
      expect(input.contentEditable).toBe(value)
    }
  })

  it('updates contentEditable without confusing false, inherit and absence', () => {
    const { element, parent } = mount('dom', normalizeProps.element({ contentEditable: false }))
    expect(element.isContentEditable).toBe(false)
    spreadProps(element, normalizeProps.element({ contentEditable: 'inherit' }))
    expect(element.contentEditable).toBe('inherit')
    parent.contentEditable = 'false'
    expect(element.isContentEditable).toBe(false)
    parent.contentEditable = 'true'
    expect(element.isContentEditable).toBe(true)
    spreadProps(element, normalizeProps.element({ contentEditable: 'false' }))
    expect(element.isContentEditable).toBe(false)
    spreadProps(element, {})
    expect(element.hasAttribute('contenteditable')).toBe(false)
    expect(element.contentEditable).toBe('inherit')
    expect(element.isContentEditable).toBe(true)
  })

  it.each(modes)('retains true boolean disabled presence semantics (%s)', (mode) => {
    const disabled = mount(mode, normalizeProps.button({ disabled: true }), 'button').element as HTMLButtonElement
    const enabled = mount(mode, normalizeProps.button({ disabled: false }), 'button').element as HTMLButtonElement
    expect(disabled.disabled).toBe(true)
    expect(disabled.hasAttribute('disabled')).toBe(true)
    expect(enabled.disabled).toBe(false)
    expect(enabled.hasAttribute('disabled')).toBe(false)
  })
})

describe('native enumerated attribute reflection (Chromium required)', () => {
  it('uses native boolean IDL reflectors rather than a DOM shim', () => {
    const element = document.createElement('a')
    expect(typeof element.draggable).toBe('boolean')
    expect(typeof element.spellcheck).toBe('boolean')
    expect(typeof element.translate).toBe('boolean')
  })

  it.each(modes)('preserves false and string-false draggable on default-draggable anchors (%s)', (mode) => {
    for (const draggable of [false, 'false'] as const) {
      const input = Object.freeze({ draggable })
      const { element } = mount(mode, { ...normalizeProps.element(input), href: '/#enumerated-anchor' }, 'a')
      expect(element.getAttribute('draggable')).toBe('false')
      expect(element.draggable).toBe(false)
      expect(input.draggable).toBe(draggable)
    }
  })

  it.each(modes)('preserves draggable true on ordinary non-draggable elements (%s)', (mode) => {
    const { element } = mount(mode, normalizeProps.element({ draggable: true }))
    expect(element.getAttribute('draggable')).toBe('true')
    expect(element.draggable).toBe(true)
  })

  it('restores native draggable Auto after omission, null and undefined', () => {
    for (const omitted of [{}, { draggable: null }, { draggable: undefined }]) {
      const { element } = mount('dom', { href: '/#enumerated-removal', draggable: 'false' }, 'a')
      expect(element.draggable).toBe(false)
      spreadProps(element, { href: '/#enumerated-removal', ...omitted })
      expect(element.hasAttribute('draggable')).toBe(false)
      expect(element.draggable).toBe(true)
    }
  })

  it.each(modes)('preserves explicit spellcheck false instead of inherited true (%s)', (mode) => {
    for (const spellCheck of [false, 'false'] as const) {
      const input = Object.freeze({ spellCheck })
      const { element } = mount(mode, normalizeProps.input(input), 'input')
      expect(element.getAttribute('spellcheck')).toBe('false')
      expect(element.spellcheck).toBe(false)
      expect(input.spellCheck).toBe(spellCheck)
    }
  })

  it('restores inherited spellcheck when the explicit attribute is removed', () => {
    const { element } = mount('dom', normalizeProps.input({ spellCheck: 'false' }), 'input')
    expect(element.spellcheck).toBe(false)
    spreadProps(element, {})
    expect(element.hasAttribute('spellcheck')).toBe(false)
    expect(element.spellcheck).toBe(true)
  })

  it.each(modes)('keeps typed translate yes/no tokens and their reflected behavior (%s)', (mode) => {
    for (const translate of ['yes', 'no'] as const) {
      const input = Object.freeze({ translate })
      const { element } = mount(mode, normalizeProps.element(input))
      expect(element.getAttribute('translate')).toBe(translate)
      expect(element.translate).toBe(translate === 'yes')
      expect(input.translate).toBe(translate)
    }
  })

  it('restores translate inheritance after removing an explicit token', () => {
    const { element, parent } = mount('dom', normalizeProps.element({ translate: 'no' }))
    expect(element.translate).toBe(false)
    spreadProps(element, {})
    expect(element.hasAttribute('translate')).toBe(false)
    expect(element.translate).toBe(true)
    parent.setAttribute('translate', 'no')
    expect(element.translate).toBe(false)
  })

  it('honors real ColorPicker boolean-false and NumberInput string-false connector props', () => {
    const color = colorConnect(colorMachine({ id: 'enum-color-vanilla' }).getState(), () => {}, normalizeProps)
    const number = numberConnect(numberMachine({ id: 'enum-number-vanilla' }).getState(), () => {}, normalizeProps)
    const colorInput = mount('dom', color.getChannelInputProps({ channel: 'hex' }), 'input').element
    const numberInput = mount('dom', number.getInputProps(), 'input').element
    expect(colorInput.getAttribute('spellcheck')).toBe('false')
    expect(numberInput.getAttribute('spellcheck')).toBe('false')
    expect(colorInput.spellcheck).toBe(false)
    expect(numberInput.spellcheck).toBe(false)
  })
})
