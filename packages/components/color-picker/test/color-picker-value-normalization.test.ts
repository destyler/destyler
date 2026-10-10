// @vitest-environment happy-dom
import type { Color, Context } from '../index'
import { normalizeProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine, parse } from '../index'

const services: Array<ReturnType<typeof machine>> = []

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
  vi.useRealTimers()
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'value-normalization', ...context })
  services.push(service)
  return { service, api: () => connect(service.state, service.send, normalizeProps) }
}

const red = parse('#FF0000')
const blue = parse('#0000FF')
const green = parse('#00FF00')
const black = parse('#000000')

const initialCases: Array<{ name: string, context: Partial<Context>, expected: Color, controlled: boolean }> = [
  { name: 'omitted values', context: {}, expected: black, controlled: false },
  { name: 'own undefined value', context: { value: undefined }, expected: black, controlled: true },
  { name: 'own undefined default', context: { defaultValue: undefined }, expected: black, controlled: false },
  { name: 'default alone', context: { defaultValue: red }, expected: red, controlled: false },
  { name: 'value alone', context: { value: blue }, expected: blue, controlled: true },
  { name: 'default before value', context: { defaultValue: red, value: blue }, expected: red, controlled: true },
  { name: 'default with undefined value', context: { defaultValue: red, value: undefined }, expected: red, controlled: true },
  { name: 'value with undefined default', context: { defaultValue: undefined, value: blue }, expected: blue, controlled: true },
  { name: 'both own undefined', context: { defaultValue: undefined, value: undefined }, expected: black, controlled: true },
]

describe('color-picker public value normalization', () => {
  it.each(initialCases)('preserves context enumeration order for $name', ({ context }) => {
    const { service } = setup(context)
    const keys = [
      'dir',
      'value',
      'format',
      'disabled',
      'closeOnSelect',
      'openAutoFocus',
      'id',
      ...(context.defaultValue === undefined ? [] : ['defaultValue']),
      'controllable.provided',
      'activeId',
      'activeChannel',
      'activeOrientation',
      'fieldsetDisabled',
      'restoreFocus',
      'positioning',
    ]
    expect(Object.keys(service.state.context)).toEqual(keys)
    expect(Object.keys({ ...service.state.context })).toEqual(keys)
    service.start()
    service.setContext({ value: green })
    service.setContext({ value: undefined })
    expect(Object.keys(service.state.context)).toEqual(keys)
  })

  it.each(initialCases)('preserves normalized color and ownership for $name', ({ context, expected, controlled }) => {
    const onValueChange = vi.fn()
    const onValueChangeEnd = vi.fn()
    const { service, api } = setup({ ...context, onValueChange, onValueChangeEnd })

    // Connecting before start must expose the resolved color, including its computed views.
    expect(api().value.toJSON()).toEqual(expected.toJSON())
    expect(api().valueAsString).toBe(expected.toString('rgba'))
    expect(api().alpha).toBe(expected.getChannelValue('alpha'))
    expect(api().getChannelValue('red')).toBe(expected.getChannelValue('red').toString())
    expect(api().getSwatchTriggerState({ value: expected }).checked).toBe(true)

    service.setContext({ value: undefined })
    expect(api().value.toJSON()).toEqual(expected.toJSON())
    service.start()
    expect(api().value.toJSON()).toEqual(expected.toJSON())
    service.setContext({ value: undefined, defaultValue: undefined })
    expect(api().value.toJSON()).toEqual(expected.toJSON())
    expect(onValueChange).not.toHaveBeenCalled()

    api().setValue(green)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({
      value: green,
      valueAsString: green.toString('rgba'),
    })
    expect(api().value.toJSON()).toEqual((controlled ? expected : green).toJSON())

    service.setContext({ value: green })
    expect(api().value.toJSON()).toEqual(green.toJSON())
    service.setContext({ value: undefined })
    expect(api().value.toJSON()).toEqual(green.toJSON())

    // A parent patch does not silently change the ownership stamped at construction.
    api().setValue(blue)
    expect(api().value.toJSON()).toEqual((controlled ? green : blue).toJSON())
    expect(onValueChange).toHaveBeenCalledTimes(2)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })

  it('does not treat inherited value as an own provided value', () => {
    const context = Object.create({ value: blue })
    context.id = 'inherited-value'
    const service = machine(context)
    services.push(service)
    const api = () => connect(service.state, service.send, normalizeProps)
    expect(api().value.toJSON()).toEqual(black.toJSON())
    service.start()
    api().setValue(green)
    expect(api().value.toJSON()).toEqual(green.toJSON())
  })

  it('ignores missing VALUE.SET colors and keeps the resolved value', () => {
    const onValueChange = vi.fn()
    const { service, api } = setup({ defaultValue: red, onValueChange })
    service.start()
    service.send({ type: 'VALUE.SET' })
    service.send({ type: 'VALUE.SET', value: undefined })
    expect(api().value.toJSON()).toEqual(red.toJSON())
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('reads the latest value when a queued channel input synchronization runs', async () => {
    vi.useFakeTimers()
    const control = document.createElement('div')
    control.id = 'color-picker:value-normalization:control'
    const input = document.createElement('input')
    input.dataset.channel = 'hex'
    control.append(input)
    document.body.append(control)
    const { service } = setup()
    service.start()
    service.setContext({ value: red })
    await Promise.resolve()
    service.setContext({ value: blue })
    await Promise.resolve()
    await vi.runOnlyPendingTimersAsync()
    expect(input.value).toBe('#0000FF')
  })

  it('rejects a fabricated state with an undefined value instead of supplying a color', () => {
    const { service } = setup({ defaultValue: red })
    const state = service.getState()
    const invalidState = { ...state, context: { ...state.context, value: undefined } }
    const send = vi.fn()
    expect(() => connect(invalidState, send, normalizeProps)).toThrow(TypeError)
    expect(send).not.toHaveBeenCalled()
    expect(service.state.context.value?.toJSON()).toEqual(red.toJSON())
  })
})
