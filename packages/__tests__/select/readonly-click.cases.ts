import type { UserDefinedContext } from '../../components/select/src/types'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../../components/select/src/collection'
import { connect } from '../../components/select/src/connect'
import { machine } from '../../components/select/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const items = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Disabled', disabled: true }]
const services: ReturnType<typeof machine>[] = []
const roots: HTMLElement[] = []
let unrelated: HTMLElement
beforeAll(() => {
  unrelated = document.createElement('div')
  document.body.append(unrelated)
})
beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  vi.clearAllTimers()
  vi.useRealTimers()
  for (const root of roots.splice(0))
    root.remove()
  expect(unrelated.isConnected).toBe(true)
})
afterAll(() => unrelated.remove())

function setup(controlled: boolean, context: Partial<UserDefinedContext> = {}) {
  const onValueChange = vi.fn()
  const onOpenChange = vi.fn()
  const service = machine({
    id: 'readonly-click',
    collection: collection({ items }),
    defaultOpen: true,
    ...(controlled ? { value: ['a'] } : { defaultValue: ['a'] }),
    onValueChange,
    onOpenChange,
    ...context,
  })
  services.push(service)
  const api = () => connect(service.getState(), service.send, normalize)
  function apply(element: HTMLElement, props: Record<string, any>) {
    for (const [name, value] of Object.entries(props)) {
      if (typeof value === 'function' || name === 'style' || name === 'defaultValue' || value === undefined)
        continue
      if (['disabled', 'hidden', 'multiple', 'required'].includes(name)) {
        element.toggleAttribute(name, !!value)
      }
      else {
        element.setAttribute(name, String(value))
      }
    }
  }
  const trigger = document.createElement('button')
  apply(trigger, api().getTriggerProps())
  const content = document.createElement('div')
  apply(content, api().getContentProps())
  const clear = document.createElement('button')
  apply(clear, api().getClearTriggerProps())
  clear.hidden = false
  const item = document.createElement('div')
  apply(item, api().getItemProps({ item: items[1] }))
  const select = document.createElement('select')
  apply(select, api().getHiddenSelectProps())
  for (const value of items) {
    const option = document.createElement('option')
    option.value = value.value
    option.textContent = value.label
    select.append(option)
  }
  item.addEventListener('click', event => api().getItemProps({ item: items[1] }).onClick(event))
  clear.addEventListener('click', event => api().getClearTriggerProps().onClick(event))
  content.append(item)
  const root = document.createElement('div')
  roots.push(root)
  root.append(trigger, content, clear, select)
  document.body.append(root)
  service.start()
  return { service, api, root, item, clear, select, onValueChange, onOpenChange }
}

const nativeValues = (node: HTMLSelectElement) => Array.from(node.options).filter(option => option.selected).map(option => option.value)

for (const controlled of [false, true]) {
  for (const multiple of [false, true]) {
    describe(`select pointer value guards, controlled=${controlled}, multiple=${multiple}`, () => {
      for (const readOnly of [false, true]) {
        it.each(['item', 'clear'] as const)(`readOnly=${readOnly} respects %s activation`, async (target) => {
          const fixture = setup(controlled, { multiple, readOnly })
          fixture[target].click()
          await vi.advanceTimersByTimeAsync(0)
          const next = target === 'clear' ? [] : multiple ? ['a', 'b'] : ['b']
          if (readOnly) {
            expect(fixture.onValueChange).not.toHaveBeenCalled()
            expect(fixture.onOpenChange).not.toHaveBeenCalled()
            expect(fixture.api().value).toEqual(['a'])
            expect(fixture.api().open).toBe(true)
            expect(nativeValues(fixture.select)).toEqual(['a'])
          }
          else {
            expect(fixture.onValueChange).toHaveBeenCalledTimes(1)
            expect(fixture.onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: next }))
            expect(fixture.api().value).toEqual(controlled ? ['a'] : next)
            expect(nativeValues(fixture.select)).toEqual(controlled ? ['a'] : next)
            expect(fixture.api().open).toBe(target === 'clear' || multiple)
            if (controlled) {
              fixture.service.setContext({ value: next })
              await vi.advanceTimersByTimeAsync(0)
              expect(fixture.api().value).toEqual(next)
              expect(nativeValues(fixture.select)).toEqual(next)
            }
          }
        })
      }
    })
  }
}

it.each(['item', 'clear'] as const)('preserves disabled %s behavior', (target) => {
  const fixture = setup(false, { disabled: true })
  fixture[target].click()
  expect(fixture.onValueChange).not.toHaveBeenCalled()
  expect(fixture.api().value).toEqual(['a'])
})

it.each(['item', 'clear'] as const)('preserves prevented %s clicks', (target) => {
  const fixture = setup(false)
  fixture[target].addEventListener('click', event => event.preventDefault(), { capture: true })
  fixture[target].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  expect(fixture.onValueChange).not.toHaveBeenCalled()
  expect(fixture.api().value).toEqual(['a'])
})

it.each([false, true])('keeps programmatic value changes available with readOnly and controlled=%s', (controlled) => {
  const fixture = setup(controlled, { readOnly: true })
  fixture.api().setValue(['b'])
  expect(fixture.onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['b'] }))
  expect(fixture.api().value).toEqual(controlled ? ['a'] : ['b'])
})

it.each(['item', 'clear'] as const)('honors readOnly toggled while %s is already mounted', async (target) => {
  const fixture = setup(false, { closeOnSelect: false })
  fixture.service.setContext({ readOnly: true })
  await vi.advanceTimersByTimeAsync(0)
  fixture[target].click()
  expect(fixture.onValueChange).not.toHaveBeenCalled()
  expect(fixture.api().value).toEqual(['a'])
  fixture.service.setContext({ readOnly: false })
  await vi.advanceTimersByTimeAsync(0)
  fixture[target].click()
  expect(fixture.onValueChange).toHaveBeenCalledTimes(1)
  expect(fixture.api().value).toEqual(target === 'clear' ? [] : ['b'])
})

it('preserves an individually disabled collection item', () => {
  const fixture = setup(false)
  const disabledItem = document.createElement('div')
  disabledItem.addEventListener('click', fixture.api().getItemProps({ item: items[2] }).onClick)
  fixture.root.append(disabledItem)
  disabledItem.click()
  expect(fixture.onValueChange).not.toHaveBeenCalled()
  expect(fixture.api().value).toEqual(['a'])
})
