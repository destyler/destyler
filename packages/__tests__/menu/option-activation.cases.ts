import type { OptionItemProps, UserDefinedContext } from '../../components/menu/src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../../components/menu/src/connect'
import { machine } from '../../components/menu/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

function setup(option: Partial<OptionItemProps> = {}, context: Partial<UserDefinedContext> = {}) {
  const onCheckedChange = vi.fn()
  const onSelect = vi.fn()
  const onOpenChange = vi.fn()
  const props: OptionItemProps = { value: 'option', type: 'checkbox', checked: false, onCheckedChange, ...option }
  const service = machine({ id: 'option-activation', defaultOpen: true, onSelect, onOpenChange, ...context })
  services.push(service)
  const api = () => connect(service.getState(), service.send, normalize)
  const trigger = document.createElement('button')
  const content = document.createElement('div')
  const item = document.createElement('div')
  trigger.id = api().getTriggerProps().id
  for (const [name, value] of Object.entries(api().getContentProps())) {
    if (typeof value !== 'function' && value !== undefined && name !== 'style')
      content.setAttribute(name, String(value))
  }
  content.removeAttribute('hidden')
  for (const [name, value] of Object.entries(api().getOptionItemProps(props))) {
    if (typeof value !== 'function' && value !== undefined && name !== 'style')
      item.setAttribute(name, String(value))
  }
  item.addEventListener('pointerdown', event => api().getOptionItemProps(props).onPointerDown(event))
  item.addEventListener('click', event => api().getOptionItemProps(props).onClick(event))
  content.addEventListener('keydown', event => api().getContentProps().onKeyDown(event))
  content.append(item)
  document.body.append(trigger, content)
  service.start()
  return { service, api, content, item, onCheckedChange, onSelect, onOpenChange, props }
}

async function activate(fixture: ReturnType<typeof setup>, input: 'pointer' | 'Enter' | ' ') {
  if (input === 'pointer') {
    fixture.item.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
    fixture.item.click()
  }
  else {
    fixture.api().setHighlightedValue(fixture.props.value)
    fixture.content.dispatchEvent(new KeyboardEvent('keydown', { key: input, bubbles: true, cancelable: true }))
  }
  await Promise.resolve()
}

describe('menu option activation', () => {
  for (const type of ['checkbox', 'radio'] as const) {
    for (const checked of [false, true]) {
      it.each(['pointer', 'Enter', ' '] as const)(`${type} checked=${checked} emits one correct change for %s`, async (input) => {
        const fixture = setup({ type, checked, closeOnSelect: false })
        await activate(fixture, input)
        expect(fixture.onCheckedChange.mock.calls).toEqual([[type === 'radio' ? true : !checked]])
        expect(fixture.onSelect.mock.calls).toEqual([[{ value: 'option' }]])
        expect(fixture.api().open).toBe(true)
        // Checked state remains externally owned until the consumer renders new props.
        expect(fixture.api().getOptionItemState(fixture.props).checked).toBe(checked)
      })
    }
  }

  it.each([false, true])('preserves close-on-select with controlled=%s', async (controlled) => {
    const fixture = setup({}, controlled ? { open: true } : {})
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
    expect(fixture.onSelect.mock.calls).toEqual([[{ value: 'option' }]])
    expect(fixture.onOpenChange.mock.calls).toEqual([[{ open: false }]])
    expect(fixture.api().open).toBe(controlled)
    if (controlled) {
      fixture.service.setContext({ open: false })
      await Promise.resolve()
      expect(fixture.api().open).toBe(false)
      expect(fixture.onCheckedChange).toHaveBeenCalledTimes(1)
    }
  })

  it.each(['checkbox', 'radio'] as const)('ignores a disabled %s option', async (type) => {
    const fixture = setup({ type, disabled: true })
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange).not.toHaveBeenCalled()
    expect(fixture.onSelect).not.toHaveBeenCalled()
    expect(fixture.onOpenChange).not.toHaveBeenCalled()
    expect(fixture.api().open).toBe(true)
  })

  it('keeps an item-level closeOnSelect=false override', async () => {
    const fixture = setup({ closeOnSelect: false }, { closeOnSelect: true })
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
    expect(fixture.onOpenChange).not.toHaveBeenCalled()
    expect(fixture.api().open).toBe(true)
  })

  it.each(['Enter', ' '])('does not activate on a prevented %s keydown', async (key) => {
    const fixture = setup()
    fixture.api().setHighlightedValue(fixture.props.value)
    fixture.content.addEventListener('keydown', event => event.preventDefault(), { capture: true })
    fixture.content.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    await Promise.resolve()
    expect(fixture.onCheckedChange).not.toHaveBeenCalled()
    expect(fixture.onSelect).not.toHaveBeenCalled()
    expect(fixture.api().open).toBe(true)
  })

  it('leaves option changes entirely to an overridden setOptionState action', async () => {
    const fixture = setup({ closeOnSelect: false })
    const setOptionState = vi.fn()
    fixture.service.setOptions({ actions: { setOptionState } })
    await activate(fixture, 'pointer')
    expect(setOptionState).toHaveBeenCalledTimes(1)
    expect(setOptionState.mock.calls[0][1].option).toMatchObject(fixture.props)
    expect(fixture.onCheckedChange).not.toHaveBeenCalled()
    expect(fixture.onSelect.mock.calls).toEqual([[{ value: 'option' }]])
  })
})

// These cases exercise the callback contract, including accessor-backed props.
describe('menu option callback boundaries', () => {
  for (const placement of ['inherited', 'non-enumerable'] as const) {
    it(`preserves a ${placement} callback without a second notification`, async () => {
      const fixture = setup({ closeOnSelect: false })
      delete fixture.props.onCheckedChange
      const descriptor = {
        get() {
          expect(this).toBe(fixture.props)
          return fixture.onCheckedChange
        },
        configurable: true,
      }
      if (placement === 'inherited')
        Object.setPrototypeOf(fixture.props, Object.create(null, { onCheckedChange: descriptor }))
      else
        Object.defineProperty(fixture.props, 'onCheckedChange', descriptor)
      await activate(fixture, 'pointer')
      expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
      expect(fixture.onSelect.mock.calls).toEqual([[{ value: 'option' }]])
    })
  }

  for (const placement of ['inherited', 'non-enumerable'] as const) {
    for (const type of ['checkbox', 'radio'] as const) {
      for (const checked of [false, true]) {
        it.each(['type', 'checked', 'both', 'all'] as const)(`${placement} ${type} checked=${checked} retains %s option fields`, async (fields) => {
          const fixture = setup({ type, checked, closeOnSelect: false })
          const values = { type, checked, onCheckedChange: fixture.onCheckedChange }
          const keys: Array<keyof typeof values> = fields === 'all'
            ? ['type', 'checked', 'onCheckedChange']
            : fields === 'both' ? ['type', 'checked'] : [fields]
          const descriptors: PropertyDescriptorMap = {}
          for (const key of keys) {
            Reflect.deleteProperty(fixture.props, key)
            descriptors[key] = {
              get() {
                expect(this).toBe(fixture.props)
                return values[key]
              },
              configurable: true,
            }
          }
          if (placement === 'inherited')
            Object.setPrototypeOf(fixture.props, Object.create(null, descriptors))
          else
            Object.defineProperties(fixture.props, descriptors)
          await activate(fixture, 'pointer')
          expect(fixture.onCheckedChange.mock.calls).toEqual([[type === 'radio' ? true : !checked]])
          expect(fixture.api().getOptionItemProps(fixture.props)['aria-checked']).toBe(checked)
        })
      }
    }

    it(`${placement} option value fallbacks do not reread getters`, () => {
      const fixture = setup({ closeOnSelect: false })
      let typeReads = 0
      let checkedReads = 0
      const descriptors = {
        type: {
          get() {
            typeReads++
            return 'checkbox'
          },
          configurable: true,
        },
        checked: {
          get() {
            checkedReads++
            return true
          },
          configurable: true,
        },
      }
      Reflect.deleteProperty(fixture.props, 'type')
      Reflect.deleteProperty(fixture.props, 'checked')
      if (placement === 'inherited')
        Object.setPrototypeOf(fixture.props, Object.create(null, descriptors))
      else
        Object.defineProperties(fixture.props, descriptors)
      const props = fixture.api().getOptionItemProps(fixture.props)
      expect(typeReads).toBe(1)
      expect(checkedReads).toBe(1)
      props.onClick({ currentTarget: fixture.item })
      expect(fixture.onCheckedChange.mock.calls).toEqual([[false]])
      expect(typeReads).toBe(1)
      expect(checkedReads).toBe(1)
    })
  }

  it('keeps an own enumerable checked snapshot distinct from later getter values', () => {
    const fixture = setup({ closeOnSelect: false })
    let reads = 0
    Object.defineProperty(fixture.props, 'checked', {
      get: () => ++reads === 1,
      enumerable: true,
      configurable: true,
    })
    const props = fixture.api().getOptionItemProps(fixture.props)
    expect(props['aria-checked']).toBe(false)
    props.onClick({ currentTarget: fixture.item })
    expect(fixture.onCheckedChange.mock.calls).toEqual([[false]])
    expect(reads).toBe(3)
  })

  it('keeps an own enumerable type snapshot distinct from the early getter value', () => {
    const fixture = setup({ closeOnSelect: false, checked: true })
    let reads = 0
    Object.defineProperty(fixture.props, 'type', {
      get: () => ++reads === 2 ? 'radio' : 'checkbox',
      enumerable: true,
      configurable: true,
    })
    const props = fixture.api().getOptionItemProps(fixture.props)
    expect(props.role).toBe('menuitemcheckbox')
    props.onClick({ currentTarget: fixture.item })
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
    expect(reads).toBe(3)
  })

  it('does not add absent type or checked keys to the overridden action payload', async () => {
    const fixture = setup({ closeOnSelect: false })
    Reflect.deleteProperty(fixture.props, 'type')
    Reflect.deleteProperty(fixture.props, 'checked')
    const action = vi.fn()
    fixture.service.setOptions({ actions: { setOptionState: action } })
    await activate(fixture, 'pointer')
    expect(Object.prototype.hasOwnProperty.call(action.mock.calls[0][1].option, 'type')).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(action.mock.calls[0][1].option, 'checked')).toBe(false)
  })

  it('snapshots an own getter callback once per emitted option event', () => {
    const fixture = setup({ closeOnSelect: false })
    const first = vi.fn()
    const second = vi.fn()
    let reads = 0
    Object.defineProperty(fixture.props, 'onCheckedChange', {
      configurable: true,
      enumerable: true,
      get: () => (++reads === 1 ? first : second),
    })
    const handler = fixture.api().getOptionItemProps(fixture.props).onClick
    handler({ currentTarget: fixture.item })
    expect(first).not.toHaveBeenCalled()
    expect(second.mock.calls).toEqual([[true]])
    expect(reads).toBe(3)
  })

  it('retains early callback getter evaluation before snapshotting checked', async () => {
    const fixture = setup({ closeOnSelect: false })
    delete fixture.props.onCheckedChange
    Object.setPrototypeOf(fixture.props, {
      get onCheckedChange() {
        fixture.props.checked = true
        return fixture.onCheckedChange
      },
    })
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange.mock.calls).toEqual([[false]])
  })

  it('preserves an explicit undefined own callback over an inherited callback', async () => {
    const fixture = setup({ closeOnSelect: false, onCheckedChange: undefined })
    Object.setPrototypeOf(fixture.props, { onCheckedChange: fixture.onCheckedChange })
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange).not.toHaveBeenCalled()
    expect(fixture.onSelect).toHaveBeenCalledTimes(1)
  })

  it('keeps the event snapshot when onSelect synchronously replaces consumer props', async () => {
    const fixture = setup({ closeOnSelect: false })
    const replacement = vi.fn()
    fixture.service.setContext({
      onSelect() {
        fixture.props.checked = true
        fixture.props.onCheckedChange = replacement
      },
    })
    await activate(fixture, 'pointer')
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
    expect(replacement).not.toHaveBeenCalled()
    await activate(fixture, 'pointer')
    expect(replacement.mock.calls).toEqual([[false]])
  })

  it('keeps onSelect then checked then close notification order', async () => {
    const order: string[] = []
    const fixture = setup({ onCheckedChange: () => order.push('checked') }, {
      onSelect: () => order.push('select'),
      onOpenChange: () => order.push('close'),
    })
    await activate(fixture, 'pointer')
    expect(order).toEqual(['select', 'checked', 'close'])
  })

  it('emits one proposal per reentrant activation and keeps checked consumer-owned', async () => {
    const fixture = setup({ closeOnSelect: false })
    const clicks: Event[] = []
    const reentrantClick = new MouseEvent('click', { bubbles: true, cancelable: true })
    fixture.item.addEventListener('click', event => clicks.push(event), { capture: true })
    fixture.props.onCheckedChange = vi.fn((checked) => {
      if (fixture.onCheckedChange.mock.calls.length === 0) {
        fixture.onCheckedChange(checked)
        // A fresh event reaches the connector while this activation is in progress.
        // HTMLElement.click() would suppress same-element reentry in native browsers.
        fixture.item.dispatchEvent(reentrantClick)
      }
      else {
        fixture.onCheckedChange(checked)
      }
    })
    await activate(fixture, 'pointer')
    expect(clicks).toHaveLength(2)
    expect(clicks[0]).not.toBe(reentrantClick)
    expect(clicks[1]).toBe(reentrantClick)
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true], [true]])
    expect(fixture.onSelect).toHaveBeenCalledTimes(2)
    expect(fixture.props.checked).toBe(false)
  })

  for (const type of ['checkbox', 'radio'] as const) {
    it(`${type} proposals remain externally owned across repeated and accepted inputs`, async () => {
      const fixture = setup({ type, checked: true, closeOnSelect: false })
      await activate(fixture, 'pointer')
      await activate(fixture, 'Enter')
      expect(fixture.onCheckedChange.mock.calls).toEqual([[type === 'radio'], [type === 'radio']])
      fixture.props.checked = false
      await activate(fixture, ' ')
      expect(fixture.onCheckedChange.mock.calls[2]).toEqual([true])
      expect(fixture.api().getOptionItemProps(fixture.props)['aria-checked']).toBe(false)
    })
    it.each(['Enter', ' '] as const)(`disabled ${type} does not activate through %s`, async (input) => {
      const fixture = setup({ type, disabled: true })
      await activate(fixture, input)
      expect(fixture.onCheckedChange).not.toHaveBeenCalled()
      expect(fixture.onSelect).not.toHaveBeenCalled()
      expect(fixture.api().open).toBe(true)
    })
  }

  it.each(['download', 'new-tab'] as const)('ignores a %s anchor activation', (kind) => {
    const fixture = setup()
    const anchor = document.createElement('a')
    anchor.href = '#menu-option'
    if (kind === 'download')
      anchor.setAttribute('download', 'file')
    fixture.api().getOptionItemProps(fixture.props).onClick({ currentTarget: anchor, altKey: kind === 'download', ctrlKey: kind === 'new-tab', metaKey: kind === 'new-tab' })
    expect(fixture.onCheckedChange).not.toHaveBeenCalled()
    expect(fixture.onOpenChange).not.toHaveBeenCalled()
  })

  it('preserves the existing click defaultPrevented policy', async () => {
    const fixture = setup({ closeOnSelect: false })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    event.preventDefault()
    fixture.item.dispatchEvent(event)
    await Promise.resolve()
    // Unlike content keydown, a standalone item click has no veto check.
    expect(fixture.onCheckedChange.mock.calls).toEqual([[true]])
  })

  it('does not add an absent callback property to the overridden action payload', async () => {
    const fixture = setup({ closeOnSelect: false })
    delete fixture.props.onCheckedChange
    const action = vi.fn()
    fixture.service.setOptions({ actions: { setOptionState: action } })
    await activate(fixture, 'pointer')
    expect(Object.prototype.hasOwnProperty.call(action.mock.calls[0][1].option, 'onCheckedChange')).toBe(false)
  })

  it('uses the current override of setOptionState and does not invoke a fallback', async () => {
    const fixture = setup({ closeOnSelect: false })
    const action = vi.fn((_ctx, evt) => evt.option.onCheckedChange(false))
    fixture.service.setOptions({ actions: { setOptionState: action } })
    await activate(fixture, 'pointer')
    expect(action).toHaveBeenCalledTimes(1)
    expect(fixture.onCheckedChange.mock.calls).toEqual([[false]])
  })
})
