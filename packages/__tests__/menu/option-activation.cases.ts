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
