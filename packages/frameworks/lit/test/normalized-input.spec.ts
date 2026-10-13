import { html, nothing, render } from 'lit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { spread } from '../src/directives/spread-props'
import { normalizeProps } from '../src/utils/normalize-props'

const cleanups: (() => void)[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function mount(initial: Record<string, unknown>) {
  const container = document.createElement('div')
  document.body.append(container)
  const view = (props: Record<string, unknown>) => html`<form><input ${spread(normalizeProps.input(props))}></form>`
  const update = (props: Record<string, unknown>) => render(view(props), container)
  update(initial)
  cleanups.push(() => {
    render(nothing, container)
    container.remove()
  })
  return { input: container.querySelector('input')!, form: container.querySelector('form')!, update }
}

describe('lit normalized input attributes', () => {
  it.each(['checked', 'defaultChecked'] as const)('renders and updates %s with native boolean semantics', (key) => {
    const retained = { 'type': 'checkbox', 'name': 'feature', 'defaultValue': 'enabled', 'aria-checked': false, 'data-active': false }
    const { input, form, update } = mount({ ...retained, [key]: false })
    expect(input.checked).toBe(false)
    expect(input.defaultChecked).toBe(false)
    expect(input.hasAttribute('checked')).toBe(false)

    for (const value of [true, false, true, undefined, true, null, false]) {
      const props: Readonly<Record<string, unknown>> = Object.freeze({ ...retained, [key]: value })
      update(props)
      expect(form.querySelector('input')).toBe(input)
      expect(input.checked).toBe(value === true)
      expect(input.defaultChecked).toBe(value === true)
      expect(input.getAttribute('checked')).toBe(value === true ? '' : null)
      expect(input.name).toBe('feature')
      expect(input.value).toBe('enabled')
      expect(input.defaultValue).toBe('enabled')
      expect(input.getAttribute('aria-checked')).toBe('false')
      expect(input.getAttribute('data-active')).toBe('false')
      expect(props[key]).toBe(value)
    }

    update({ ...retained, [key]: true })
    expect(input.checked).toBe(true)
    update(retained)
    expect(form.querySelector('input')).toBe(input)
    expect(input.checked).toBe(false)
    expect(input.defaultChecked).toBe(false)
    expect(input.hasAttribute('checked')).toBe(false)
    expect(input.value).toBe('enabled')
  })

  it.each([false, true])('initializes defaultChecked=%s before interaction and retains event and reset behavior', (checked) => {
    const onClick = vi.fn()
    const onChange = vi.fn()
    const retained = { type: 'checkbox', defaultValue: 'enabled', onClick, onChange }
    const { input, form, update } = mount({ ...retained, defaultChecked: checked })
    expect(input.checked).toBe(checked)
    expect(input.defaultChecked).toBe(checked)

    input.click()
    expect(input.checked).toBe(!checked)
    expect(input.defaultChecked).toBe(checked)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].type).toBe('input')

    form.reset()
    expect(input.checked).toBe(checked)
    expect(input.value).toBe('enabled')
    update({ type: 'checkbox', defaultValue: 'enabled', defaultChecked: checked })
    input.click()
    expect(input.checked).toBe(!checked)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
