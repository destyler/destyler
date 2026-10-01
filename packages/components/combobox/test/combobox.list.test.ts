// @vitest-environment happy-dom
import { normalizeProps, spreadProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0))
    cleanup()
})

function renderCombobox(composite: boolean, multiple = false, siblingList = false) {
  const items = ['Cat', 'Dog']
  const root = document.createElement('div')
  const label = document.createElement('label')
  label.textContent = 'Animal'
  const control = document.createElement('div')
  const input = document.createElement('input')
  const trigger = document.createElement('button')
  trigger.textContent = 'Open'
  const positioner = document.createElement('div')
  const content = document.createElement('div')
  const list = document.createElement('div')
  const options = items.map((item) => {
    const option = document.createElement('div')
    option.textContent = item
    return option
  })

  if (siblingList) {
    content.append(list, ...options)
  }
  else {
    list.append(...options)
    content.append(list)
  }
  control.append(...(composite ? [input, trigger] : [trigger]))
  if (!composite)
    content.prepend(input)
  root.append(label, control)
  positioner.append(content)
  document.body.append(root, positioner)

  const service = machine({
    id: 'combobox-list',
    ids: { label: 'custom-list-label' },
    composite,
    multiple,
    collection: collection({ items }),
  })
  service.start()
  const api = () => connect(service.getState(), service.send, normalizeProps)
  const render = () => {
    const current = api()
    spreadProps(root, current.getRootProps())
    spreadProps(label, current.getLabelProps())
    spreadProps(control, current.getControlProps())
    spreadProps(input, current.getInputProps())
    spreadProps(trigger, current.getTriggerProps({ focusable: !composite }))
    spreadProps(positioner, current.getPositionerProps())
    spreadProps(content, current.getContentProps())
    spreadProps(list, current.getListProps())
    options.forEach((option, index) => spreadProps(option, current.getItemProps({ item: items[index] })))
  }
  render()
  const unsubscribe = service.subscribe(render)
  cleanups.push(() => {
    unsubscribe()
    service.stop()
    root.remove()
    positioner.remove()
  })
  return { api, label, input, trigger, content, list, options }
}

describe.each([true, false])('combobox list (composite=%s)', (composite) => {
  it.each([true, false])('keeps naming and selection semantics on the listbox (multiple=%s)', (multiple) => {
    const { api, label, content, list } = renderCombobox(composite, multiple)
    const listProps = api().getListProps()
    expect(listProps).toMatchObject({
      'data-scope': 'combobox',
      'data-part': 'list',
    })
    expect(listProps.role).toBe(composite ? undefined : 'listbox')
    expect(listProps['aria-labelledby']).toBe(composite ? undefined : label.id)
    expect(listProps['aria-multiselectable']).toBe(multiple && !composite ? true : undefined)
    expect(content.getAttribute('role')).toBe(composite ? 'listbox' : 'dialog')
    expect(content.getAttribute('aria-labelledby')).toBe(label.id)
    expect(content.getAttribute('aria-multiselectable')).toBe(multiple && composite ? 'true' : null)
    expect(list.getAttribute('role')).toBe(composite ? null : 'listbox')
    expect(list.getAttribute('aria-labelledby')).toBe(composite ? null : label.id)
    expect(list.getAttribute('aria-multiselectable')).toBe(multiple && !composite ? 'true' : null)
  })

  it('keeps controls and keyboard selection working across repeated opens', async () => {
    const { api, input, trigger, content, options } = renderCombobox(composite)
    expect(input.getAttribute('aria-controls')).toBe(content.id)
    expect(trigger.getAttribute('aria-haspopup')).toBe(composite ? 'listbox' : 'dialog')
    for (let cycle = 0; cycle < 2; cycle++) {
      api().setOpen(true)
      await expect.poll(() => content.hidden).toBe(false)
      expect(trigger.getAttribute('aria-controls')).toBe(content.id)
      expect(input.getAttribute('aria-expanded')).toBe('true')
      input.focus()
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }))
      await expect.poll(() => api().highlightedValue).toBe('Cat')
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
      await expect.poll(() => api().highlightedValue).toBe('Dog')
      expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id)
      expect(document.activeElement).toBe(input)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
      await expect.poll(() => api().value).toEqual(['Dog'])
      await expect.poll(() => content.hidden).toBe(true)
      expect(api().open).toBe(false)
      expect(trigger.hasAttribute('aria-controls')).toBe(false)
    }
  })
})

describe('combobox list ownership', () => {
  it.each([
    { composite: true, siblingList: true },
    { composite: true, siblingList: false },
    { composite: false, siblingList: false },
  ])('keeps a valid option tree (composite=$composite, siblingList=$siblingList)', async ({ composite, siblingList }) => {
    const { api, content, list } = renderCombobox(composite, false, siblingList)
    // No item groups: this isolates List naming from group semantics.
    for (let cycle = 0; cycle < 2; cycle++) {
      api().setOpen(true)
      await expect.poll(() => content.hidden).toBe(false)
      const results = await axe(composite ? content : list, {
        runOnly: ['aria-required-children', 'aria-required-parent', 'aria-prohibited-attr'],
      })
      expect(results.violations).toEqual([])
      api().setOpen(false)
      await expect.poll(() => content.hidden).toBe(true)
    }
  })
})
