// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
const cleanups: Array<() => void> = []
const items = [{ label: 'Apple', value: 'apple' }, { label: 'Blocked', value: 'blocked', disabled: true }, { label: 'Cherry', value: 'cherry' }]
let id = 0
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 35))

// Real connector handlers and DOM bubbling; no synthetic forwarding of List events
// to Content. happy-dom does not establish real-browser or assistive-tech behavior.
function mount(context: Partial<UserDefinedContext> = {}, nested = true) {
  const service = machine({ id: `focus-${++id}`, collection: collection({ items }), ...context })
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  const trigger = document.createElement('button')
  const content = document.createElement('div')
  const list = nested ? document.createElement('div') : content
  const options = items.map(() => document.createElement('div'))
  root.append(trigger, content)
  if (nested)
    content.append(list)
  list.append(...options)
  document.body.append(root)

  function attrs(node: HTMLElement, props: Record<string, any>) {
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith('on') || key === 'style')
        continue
      const name = key === 'tabIndex' ? 'tabindex' : key
      if (value == null || (key === 'hidden' && !value) || (key === 'disabled' && !value))
        node.removeAttribute(name)
      else
        node.setAttribute(name, String(value))
    }
  }
  function render() {
    attrs(trigger, api().getTriggerProps())
    attrs(content, api().getContentProps())
    if (nested)
      attrs(list, api().getListProps())
    options.forEach((node, index) => attrs(node, api().getItemProps({ item: items[index] })))
  }
  trigger.addEventListener('click', event => api().getTriggerProps().onClick(event))
  trigger.addEventListener('focus', event => api().getTriggerProps().onFocus(event))
  trigger.addEventListener('blur', event => api().getTriggerProps().onBlur(event))
  trigger.addEventListener('keydown', event => api().getTriggerProps().onKeyDown(event))
  content.addEventListener('keydown', event => api().getContentProps().onKeyDown(event))
  options.forEach((node, index) => node.addEventListener('click', event => api().getItemProps({ item: items[index] }).onClick(event)))
  service.subscribe(render)
  render()
  service.start()
  cleanups.push(() => {
    service.stop()
    root.remove()
  })
  return { service, api, root, trigger, content, list, options, render }
}

function key(node: HTMLElement, value: string, veto = false) {
  const event = new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })
  if (veto)
    event.preventDefault()
  node.dispatchEvent(event)
  return event
}

async function open(fixture: ReturnType<typeof mount>) {
  fixture.trigger.focus()
  key(fixture.trigger, 'ArrowDown')
  await settle()
  fixture.render()
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup()
  vi.restoreAllMocks()
})

describe('select default composite focus ownership', () => {
  it.each([true, false])('composite=%s assigns focusability and semantics to the intended part', (composite) => {
    const f = mount({ composite, multiple: true })
    f.api().highlightValue('apple')
    f.render()
    expect(f.api().getContentProps().tabIndex).toBe(0)
    expect(f.api().getListProps().tabIndex).toBe(composite ? undefined : 0)
    expect(f.content.getAttribute('role')).toBe(composite ? 'listbox' : 'dialog')
    expect(f.list.getAttribute('role')).toBe(composite ? null : 'listbox')
    expect(f.list.hasAttribute('tabindex')).toBe(!composite)
    const owner = composite ? f.content : f.list
    const other = composite ? f.list : f.content
    expect(owner.getAttribute('aria-activedescendant')).toBe(f.options[0].id)
    expect(owner.getAttribute('aria-multiselectable')).toBe('true')
    expect(other.hasAttribute('aria-activedescendant')).toBe(false)
    expect(other.hasAttribute('aria-multiselectable')).toBe(false)
  })

  it.each([true, false])('nested=%s focuses Content and supports navigation, typeahead, selection and restoration', async (nested) => {
    const f = mount({}, nested)
    await open(f)
    expect(document.activeElement).toBe(f.content)
    expect(f.api().highlightedValue).toBe('apple')
    key(document.activeElement as HTMLElement, 'ArrowDown')
    expect(f.api().highlightedValue).toBe('cherry')
    key(f.content, 'Home')
    expect(f.api().highlightedValue).toBe('apple')
    key(f.content, 'End')
    expect(f.api().highlightedValue).toBe('cherry')
    key(f.content, 'a')
    expect(f.api().highlightedValue).toBe('apple')
    key(f.content, 'Enter')
    await settle()
    expect(f.api().value).toEqual(['apple'])
    expect(f.api().open).toBe(false)
    expect(document.activeElement).toBe(f.trigger)
  })

  it('non-composite keeps the nested List focusable and preserves bubbled keyboard navigation', async () => {
    const f = mount({ composite: false })
    await open(f)
    expect(document.activeElement).toBe(f.list)
    const event = key(f.list, 'ArrowDown')
    expect(event.defaultPrevented).toBe(true)
    expect(f.api().highlightedValue).toBe('cherry')
    f.options[2].click()
    await settle()
    expect(f.api().value).toEqual(['cherry'])
    expect(document.activeElement).toBe(f.trigger)
  })
})

for (const composite of [true, false]) {
  describe(`select compatibility composite=${composite}`, () => {
    it('controlled open defers focus until acceptance and restores after accepted close', async () => {
      const onOpenChange = vi.fn()
      const f = mount({ composite, open: false, onOpenChange })
      await open(f)
      expect(onOpenChange).toHaveBeenCalledWith({ open: true })
      expect(f.api().open).toBe(false)
      expect(document.activeElement).toBe(f.trigger)
      f.service.setContext({ open: true })
      await settle()
      expect(document.activeElement).toBe(composite ? f.content : f.list)
      f.api().setOpen(false)
      expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
      expect(f.api().open).toBe(true)
      f.service.setContext({ open: false })
      await settle()
      expect(f.api().open).toBe(false)
      expect(document.activeElement).toBe(f.trigger)
    })

    it('preserves ArrowUp, Home, End and Space selection on the focused owner', async () => {
      const f = mount({ composite })
      await open(f)
      const owner = document.activeElement as HTMLElement
      key(owner, 'End')
      expect(f.api().highlightedValue).toBe('cherry')
      key(owner, 'ArrowUp')
      expect(f.api().highlightedValue).toBe('apple')
      key(owner, 'Home')
      expect(f.api().highlightedValue).toBe('apple')
      key(owner, ' ')
      await settle()
      expect(f.api().value).toEqual(['apple'])
      expect(f.api().open).toBe(false)
      expect(document.activeElement).toBe(f.trigger)
    })

    it('escape dismisses and restores trigger focus', async () => {
      const f = mount({ composite })
      await open(f)
      key(document.activeElement as HTMLElement, 'Escape')
      await settle()
      expect(f.api().open).toBe(false)
      expect(document.activeElement).toBe(f.trigger)
    })

    it('preserves synthetic Tab and Shift+Tab boundary cancellation', async () => {
      const f = mount({ composite })
      await open(f)
      const owner = document.activeElement as HTMLElement
      for (const shiftKey of [false, true]) {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true })
        owner.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(true)
        expect(f.api().open).toBe(true)
        expect(document.activeElement).toBe(owner)
      }
      // happy-dom does not implement the browser's default sequential Tab action.
    })

    it('preserves virtual scroll callbacks on open, navigation and close', async () => {
      const scrollToIndexFn = vi.fn()
      const f = mount({ composite, scrollToIndexFn })
      await open(f)
      expect(scrollToIndexFn).toHaveBeenCalledWith({ index: 0, immediate: true })
      scrollToIndexFn.mockClear()
      key(document.activeElement as HTMLElement, 'End')
      await settle()
      expect(scrollToIndexFn).toHaveBeenCalledWith({ index: 2, immediate: false })
      scrollToIndexFn.mockClear()
      f.api().setOpen(false)
      await settle()
      expect(scrollToIndexFn).toHaveBeenCalledWith({ index: 0, immediate: true })
    })

    it('controlled value proposes selection without mutating until acceptance', async () => {
      const onValueChange = vi.fn()
      const f = mount({ composite, value: ['apple'], onValueChange })
      await open(f)
      f.options[2].click()
      expect(onValueChange).toHaveBeenCalledWith({ value: ['cherry'], items: [items[2]] })
      expect(f.api().value).toEqual(['apple'])
      f.service.setContext({ value: ['cherry'] })
      await settle()
      expect(f.api().value).toEqual(['cherry'])
      expect(document.activeElement).toBe(f.trigger)
    })

    it('multiple selection stays open and toggles without moving focus', async () => {
      const f = mount({ composite, multiple: true })
      await open(f)
      const owner = document.activeElement
      f.options[0].click()
      f.options[2].click()
      expect(f.api().value).toEqual(['apple', 'cherry'])
      f.options[0].click()
      expect(f.api().value).toEqual(['cherry'])
      expect(f.api().open).toBe(true)
      expect(document.activeElement).toBe(owner)
    })

    it.each(['disabled', 'readOnly'] as const)('%s blocks trigger, content and option interactions', async (field) => {
      const f = mount({ composite, [field]: true })
      f.trigger.click()
      key(f.trigger, 'ArrowDown')
      expect(f.api().open).toBe(false)
      // Programmatic opening is separate from user interaction eligibility.
      f.api().setOpen(true)
      await settle()
      key(f.content, 'ArrowDown')
      f.options[0].click()
      expect(f.api().highlightedValue).toBeNull()
      expect(f.api().value).toEqual([])
    })

    it('honors prevented trigger, content and option events and disabled options', async () => {
      const f = mount({ composite })
      f.trigger.focus()
      key(f.trigger, 'ArrowDown', true)
      expect(f.api().open).toBe(false)
      const click = () => {
        const event = new MouseEvent('click', { bubbles: true, cancelable: true })
        event.preventDefault()
        return event
      }
      f.trigger.dispatchEvent(click())
      expect(f.api().open).toBe(false)
      await open(f)
      key(f.content, 'End', true)
      expect(f.api().highlightedValue).toBe('apple')
      f.options[2].dispatchEvent(click())
      f.options[1].click()
      expect(f.api().value).toEqual([])
      expect(f.api().open).toBe(true)
    })

    it('restores focus on API close but respects restoreFocus=false', async () => {
      const f = mount({ composite })
      await open(f)
      f.api().setOpen(false)
      await settle()
      expect(document.activeElement).toBe(f.trigger)
      await open(f)
      const outside = document.createElement('button')
      f.root.append(outside)
      outside.focus()
      f.service.send({ type: 'CLOSE', restoreFocus: false })
      await settle()
      expect(f.api().open).toBe(false)
      expect(document.activeElement).toBe(outside)
    })

    it.each(['data-autofocus', 'autofocus'])('preserves explicit %s and existing descendant keyboard navigation', async (attribute) => {
      const f = mount({ composite })
      const input = document.createElement('input')
      input.setAttribute(attribute, '')
      f.content.prepend(input)
      await open(f)
      expect(document.activeElement).toBe(input)
      key(input, 'ArrowDown')
      expect(f.api().highlightedValue).toBe('cherry')
    })
  })
}

it('an explicit caller List tabindex remains outside default composite focus ownership', async () => {
  const f = mount()
  f.list.setAttribute('tabindex', '0')
  // This fixture render normally reapplies connector defaults. Preserve the
  // caller override on each render as a consumer merging props would do.
  f.service.subscribe(() => f.list.setAttribute('tabindex', '0'))
  await open(f)
  expect(document.activeElement).toBe(f.list)
  key(f.list, 'ArrowDown')
  expect(f.api().highlightedValue).toBe('cherry')
})
