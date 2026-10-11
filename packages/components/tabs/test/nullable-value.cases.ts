import type { Context, ValueChangeDetails } from '../index'
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

beforeEach(() => vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] }))
afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  vi.clearAllTimers()
  vi.useRealTimers()
  document.body.replaceChildren()
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'tabs-nullable', ...context })
  services.push(service)
  service.start()
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

function expectSelected(fixture: ReturnType<typeof setup>, value: string | null) {
  expect(fixture.api().value).toBe(value)
  for (const tab of ['a', 'b']) {
    expect(fixture.api().getTriggerProps({ value: tab })['aria-selected']).toBe(value === tab)
    expect(fixture.api().getContentProps({ value: tab }).hidden).toBe(value !== tab)
  }
}

function mount(fixture: ReturnType<typeof setup>, disabled = false) {
  const list = document.createElement('div')
  const listProps = fixture.api().getListProps()
  list.id = listProps.id
  list.addEventListener('keydown', event => fixture.api().getListProps().onKeyDown(event))
  const trigger = document.createElement('button')
  const props = fixture.api().getTriggerProps({ value: 'a', disabled })
  trigger.id = props.id
  trigger.setAttribute('role', 'tab')
  trigger.setAttribute('data-ownedby', list.id)
  trigger.disabled = disabled
  trigger.addEventListener('focus', () => fixture.api().getTriggerProps({ value: 'a', disabled }).onFocus())
  trigger.addEventListener('click', event => fixture.api().getTriggerProps({ value: 'a', disabled }).onClick(event))
  list.append(trigger)
  document.body.append(list)
  return trigger
}

describe('nullable Tabs value notifications', () => {
  it('repeats controlled clear proposals while vetoed and accepts a delayed parent update without echo', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ value: 'a', onValueChange })
    const initialApi = fixture.api()
    initialApi.clearValue()
    initialApi.clearValue()
    expectSelected(fixture, 'a')
    expect(onValueChange.mock.calls).toEqual([[{ value: null }], [{ value: null }]])

    fixture.service.setContext({ value: null })
    expectSelected(fixture, null)
    initialApi.clearValue()
    expect(onValueChange).toHaveBeenCalledTimes(2)

    initialApi.setValue('b')
    expectSelected(fixture, null)
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 'b' })
    fixture.service.setContext({ value: 'b' })
    expectSelected(fixture, 'b')
    initialApi.setValue('b')
    expect(onValueChange).toHaveBeenCalledTimes(3)
  })

  it('allows immediate parent acceptance from either callback branch without re-emitting', () => {
    const observed: Array<string | null> = []
    let fixture: ReturnType<typeof setup>
    const onValueChange = vi.fn(({ value }: ValueChangeDetails) => {
      observed.push(fixture.api().value)
      fixture.service.setContext({ value })
      // Re-entering after acceptance is an equality no-op for either branch.
      if (value === null)
        fixture.api().clearValue()
      else
        fixture.api().setValue(value)
    })
    fixture = setup({ value: 'a', onValueChange })
    fixture.api().clearValue()
    expectSelected(fixture, null)
    fixture.api().clearValue()
    fixture.api().setValue('b')
    expectSelected(fixture, 'b')
    expect(observed).toEqual(['a', null])
    expect(onValueChange.mock.calls).toEqual([[{ value: null }], [{ value: 'b' }]])
  })

  it('does not report parent synchronization as a new request', () => {
    const onValueChange = vi.fn()
    const onFocusChange = vi.fn()
    const fixture = setup({ value: 'a', onValueChange, onFocusChange })
    fixture.service.setContext({ value: null })
    fixture.service.setContext({ value: 'b' })
    expectSelected(fixture, 'b')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onFocusChange).not.toHaveBeenCalled()
  })

  it('mutates an uncontrolled default before reporting clear and suppresses only equal requests', () => {
    const observed: Array<string | null> = []
    let fixture: ReturnType<typeof setup>
    const onValueChange = vi.fn(() => observed.push(fixture.api().value))
    fixture = setup({ defaultValue: 'a', onValueChange })
    fixture.api().clearValue()
    expectSelected(fixture, null)
    fixture.api().clearValue()
    fixture.api().setValue('b')
    expectSelected(fixture, 'b')
    fixture.api().setValue('b')
    expect(observed).toEqual([null, 'b'])
    expect(onValueChange.mock.calls).toEqual([[{ value: null }], [{ value: 'b' }]])
  })

  it.each([false, true])('keeps absent optional callbacks safe (controlled=%s)', (controlled) => {
    const fixture = setup(controlled ? { value: 'a' } : { defaultValue: 'a' })
    expect(() => fixture.api().clearValue()).not.toThrow()
    expectSelected(fixture, controlled ? 'a' : null)
  })

  it.each([
    { label: 'omitted', context: {}, initial: null, controlled: false },
    { label: 'default null', context: { defaultValue: null }, initial: null, controlled: false },
    { label: 'default undefined', context: { defaultValue: undefined }, initial: null, controlled: false },
    { label: 'default empty string', context: { defaultValue: '' }, initial: '', controlled: false },
    { label: 'present null', context: { value: null }, initial: null, controlled: true },
    { label: 'present undefined', context: { value: undefined }, initial: null, controlled: true },
    { label: 'present empty string', context: { value: '' }, initial: '', controlled: true },
    { label: 'default with present undefined', context: { defaultValue: 'a', value: undefined }, initial: 'a', controlled: true },
    { label: 'default wins existing value', context: { defaultValue: 'a', value: 'b' }, initial: 'a', controlled: true },
  ])('preserves $label initialization and ownership without mutating caller props', ({ context, initial, controlled }) => {
    const onValueChange = vi.fn()
    const input = Object.freeze({ ...context, onValueChange })
    const keys = Reflect.ownKeys(input)
    const fixture = setup(input)
    expect(fixture.api().value).toBe(initial)
    expect(onValueChange).not.toHaveBeenCalled()
    fixture.api().clearValue()
    expect(fixture.api().value).toBe(controlled ? initial : null)
    expect(onValueChange.mock.calls).toEqual(initial === null ? [] : [[{ value: null }]])
    fixture.api().setValue('next')
    expect(fixture.api().value).toBe(controlled ? initial : 'next')
    expect(onValueChange).toHaveBeenLastCalledWith({ value: 'next' })
    expect(Reflect.ownKeys(input)).toEqual(keys)
    expect(input).toEqual({ ...context, onValueChange })
  })

  it('preserves an explicitly supplied ownership stamp and its caller-owned array', () => {
    const stamp = Object.freeze(['value'])
    const onValueChange = vi.fn()
    const input = Object.freeze({ 'defaultValue': 'a', 'controllable.provided': stamp, onValueChange })
    const fixture = setup(input)
    fixture.api().clearValue()
    expectSelected(fixture, 'a')
    expect(onValueChange.mock.calls).toEqual([[{ value: null }]])
    expect(input['controllable.provided']).toBe(stamp)
    expect(stamp).toEqual(['value'])
  })
})

describe.each([false, true])('connected Tabs deselection (controlled=%s)', (controlled) => {
  function deselectable(context: Partial<Context> = {}) {
    const onValueChange = vi.fn()
    const fixture = setup({
      ...(controlled ? { value: 'a' } : { defaultValue: 'a' }),
      deselectable: true,
      onValueChange,
      ...context,
    })
    return { ...fixture, onValueChange }
  }

  it('reports selected trigger clicks, including a vetoed repeat or uncontrolled reselection', () => {
    const fixture = deselectable()
    const trigger = mount(fixture)
    trigger.click()
    expectSelected(fixture, controlled ? 'a' : null)
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }]])
    trigger.click()
    expectSelected(fixture, 'a')
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }], [{ value: controlled ? null : 'a' }]])
    if (controlled) {
      fixture.service.setContext({ value: null })
      expectSelected(fixture, null)
      expect(fixture.onValueChange).toHaveBeenCalledTimes(2)
    }
  })

  it('reports manual Enter deselection only after its selection frame', () => {
    const fixture = deselectable({ activationMode: 'manual' })
    const trigger = mount(fixture)
    trigger.focus()
    expect(fixture.onValueChange).not.toHaveBeenCalled()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    expect(fixture.onValueChange).not.toHaveBeenCalled()
    vi.advanceTimersToNextFrame()
    expectSelected(fixture, controlled ? 'a' : null)
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }]])
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    vi.advanceTimersToNextFrame()
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }], [{ value: controlled ? null : 'a' }]])
  })

  it('does not deselect a non-deselectable selected trigger', () => {
    const fixture = deselectable({ deselectable: false, activationMode: 'manual' })
    const trigger = mount(fixture)
    trigger.focus()
    trigger.click()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    vi.advanceTimersToNextFrame()
    expectSelected(fixture, 'a')
    expect(fixture.onValueChange).not.toHaveBeenCalled()
  })

  it('keeps automatic Enter, prevented clicks and disabled clicks inert', () => {
    const fixture = deselectable()
    const trigger = mount(fixture)
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    vi.advanceTimersToNextFrame()
    const prevented = new MouseEvent('click', { bubbles: true, cancelable: true })
    prevented.preventDefault()
    trigger.dispatchEvent(prevented)
    const disabled = mount(fixture, true)
    disabled.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expectSelected(fixture, 'a')
    expect(fixture.onValueChange).not.toHaveBeenCalled()
  })
})
