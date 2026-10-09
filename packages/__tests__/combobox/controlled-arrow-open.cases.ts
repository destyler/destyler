import type { UserDefinedContext } from '../../components/combobox/src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../../components/combobox/src/collection'
import { connect } from '../../components/combobox/src/connect'
import { machine } from '../../components/combobox/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const items = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]
const cleanups: (() => void)[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
})

function setup(context: Partial<UserDefinedContext>) {
  const onOpenChange = vi.fn()
  const service = machine({ id: 'controlled-arrow-open', collection: collection({ items }), onOpenChange, ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  const input = document.createElement('input')
  input.id = api().getInputProps().id
  input.addEventListener('focus', () => api().getInputProps().onFocus())
  input.addEventListener('keydown', event => api().getInputProps().onKeyDown(event))
  const control = document.createElement('div')
  control.id = api().getControlProps().id
  control.append(input)
  const positioner = document.createElement('div')
  positioner.id = api().getPositionerProps().id
  const content = document.createElement('div')
  content.id = api().getContentProps().id
  content.setAttribute('role', 'listbox')
  positioner.append(content)
  const root = document.createElement('div')
  root.append(control, positioner)
  document.body.append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  input.focus()
  function keydown(key: string, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
    input.dispatchEvent(event)
    return event
  }
  return { service, api, input, keydown, onOpenChange }
}

describe('combobox arrow-key open ownership', () => {
  for (const inputBehavior of ['none', 'autohighlight', 'autocomplete'] as const) {
    for (const key of ['ArrowUp', 'ArrowDown']) {
      it(`${inputBehavior}: ${key} requests opening until the controlled parent accepts`, async () => {
        const f = setup({ open: false, inputBehavior })
        expect(f.keydown(key).defaultPrevented).toBe(true)
        expect(f.onOpenChange.mock.calls).toEqual([[{ open: true }]])
        expect(f.api().open).toBe(false)
        expect(f.api().getInputProps()['aria-expanded']).toBe(false)
        expect(f.api().getContentProps().hidden).toBe(true)
        f.service.setContext({ open: true })
        await vi.waitFor(() => expect(f.api().open).toBe(true))
        f.service.setContext({ open: false })
        await vi.waitFor(() => expect(f.api().open).toBe(false))
        f.keydown(key)
        expect(f.api().open).toBe(false)
        expect(f.onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: true }]])
      })
      it(`${inputBehavior}: ${key} still opens uncontrolled input`, async () => {
        const f = setup({ inputBehavior })
        f.keydown(key)
        expect(f.api().open).toBe(true)
        expect(f.onOpenChange.mock.calls).toEqual([[{ open: true }]])
        if (inputBehavior !== 'autocomplete') {
          await vi.waitFor(() => expect(f.api().highlightedValue).toBe(key === 'ArrowUp' ? 'b' : 'a'))
        }
      })
    }
  }

  it.each(['ArrowUp', 'ArrowDown'])('%s preserves user cancellation', (key) => {
    const f = setup({ open: false })
    f.input.addEventListener('keydown', event => event.preventDefault(), { capture: true, once: true })
    f.keydown(key)
    expect(f.api().open).toBe(false)
    expect(f.onOpenChange).not.toHaveBeenCalled()
  })

  it.each(['ArrowUp', 'ArrowDown'])('%s preserves IME composition', (key) => {
    const f = setup({ open: false })
    expect(f.keydown(key, { isComposing: true }).defaultPrevented).toBe(false)
    expect(f.onOpenChange).not.toHaveBeenCalled()
    expect(f.api().open).toBe(false)
  })
})
