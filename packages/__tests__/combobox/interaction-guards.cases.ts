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

function setup(context: Partial<UserDefinedContext> = {}, itemDisabled = false, asLink = false) {
  const onValueChange = vi.fn()
  const onOpenChange = vi.fn()
  const onHighlightChange = vi.fn()
  const item = { ...items[1], disabled: itemDisabled }
  const service = machine({
    id: 'interaction-guards',
    collection: collection({ items: [items[0], item] }),
    defaultOpen: true,
    defaultValue: ['a'],
    onValueChange,
    onOpenChange,
    onHighlightChange,
    ...context,
  })
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const input = document.createElement('input')
  input.id = api().getInputProps().id
  const content = document.createElement('div')
  content.id = api().getContentProps().id
  const option = document.createElement(asLink ? 'a' : 'div')
  if (asLink)
    option.setAttribute('href', '#combobox-item')
  option.id = api().getItemProps({ item }).id
  option.addEventListener('click', event => api().getItemProps({ item }).onClick(event))
  option.addEventListener('pointermove', () => api().getItemProps({ item }).onPointerMove())
  option.addEventListener('pointerleave', () => api().getItemProps({ item }).onPointerLeave())
  content.append(option)
  const trigger = document.createElement('button')
  trigger.id = api().getTriggerProps().id
  trigger.addEventListener('keydown', event => api().getTriggerProps({ focusable: true }).onKeyDown(event))
  root.append(input, trigger, content)
  document.body.append(root)
  service._created()
  service.start()
  cleanups.push(() => root.remove(), () => service.stop())
  return { service, api, option, trigger, item, onValueChange, onOpenChange, onHighlightChange }
}

function click(target: HTMLElement, init: MouseEventInit = {}) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init })
  target.dispatchEvent(event)
  return event
}

describe('combobox item interaction guards', () => {
  it.each(['enabled', 'root-disabled', 'item-disabled'] as const)('%s state and ARIA agree', (mode) => {
    const f = setup({ disabled: mode === 'root-disabled' }, mode === 'item-disabled')
    const disabled = mode !== 'enabled'
    expect(f.api().getItemState({ item: f.item }).disabled).toBe(disabled)
    expect(f.api().getItemProps({ item: f.item })['aria-disabled']).toBe(disabled ? 'true' : undefined)
    expect(f.api().getItemTextProps({ item: f.item })['data-disabled']).toBe(disabled ? '' : undefined)
  })

  for (const mode of ['enabled', 'root-disabled', 'item-disabled', 'readOnly'] as const) {
    it(`${mode}: option activation preserves interaction ownership`, () => {
      const f = setup({ disabled: mode === 'root-disabled', readOnly: mode === 'readOnly' }, mode === 'item-disabled')
      click(f.option)
      expect(f.api().value).toEqual(mode === 'enabled' ? ['b'] : ['a'])
      expect(f.onValueChange).toHaveBeenCalledTimes(mode === 'enabled' ? 1 : 0)
      expect(f.onOpenChange).toHaveBeenCalledTimes(mode === 'enabled' ? 1 : 0)
      expect(f.api().open).toBe(mode !== 'enabled')
    })
    it(`${mode}: pointer navigation preserves interaction ownership`, () => {
      const f = setup({ disabled: mode === 'root-disabled', readOnly: mode === 'readOnly' }, mode === 'item-disabled')
      f.option.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
      expect(f.api().highlightedValue).toBe(mode === 'enabled' ? 'b' : null)
      expect(f.onHighlightChange).toHaveBeenCalledTimes(mode === 'enabled' ? 1 : 0)
    })
  }

  it('a consumer-cancelled option click leaves selection, input and visibility untouched', () => {
    const f = setup()
    f.option.addEventListener('click', event => event.preventDefault(), { capture: true, once: true })
    click(f.option)
    expect(f.api().value).toEqual(['a'])
    expect(f.api().inputValue).toBe('Alpha')
    expect(f.api().open).toBe(true)
    expect(f.onValueChange).not.toHaveBeenCalled()
    expect(f.onOpenChange).not.toHaveBeenCalled()
  })

  it.each(['disabled', 'readOnly'] as const)('reacts to %s changes while open and recovers when enabled', (property) => {
    const f = setup()
    f.option.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
    expect(f.api().highlightedValue).toBe('b')
    f.onHighlightChange.mockClear()
    f.service.setContext({ [property]: true })
    f.option.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))
    click(f.option)
    expect(f.api().highlightedValue).toBe('b')
    expect(f.api().value).toEqual(['a'])
    expect(f.onHighlightChange).not.toHaveBeenCalled()
    expect(f.onValueChange).not.toHaveBeenCalled()
    f.service.setContext({ [property]: false })
    click(f.option)
    expect(f.api().value).toEqual(['b'])
    expect(f.onValueChange).toHaveBeenCalledTimes(1)
  })

  it.each([{ altKey: true }, { ctrlKey: true, metaKey: true }, { button: 2 }])('retains modified/context click handling for %o', (init) => {
    const f = setup({}, false, true)
    click(f.option, init)
    expect(f.onValueChange).not.toHaveBeenCalled()
    expect(f.api().value).toEqual(['a'])
  })
})
