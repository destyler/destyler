// @vitest-environment happy-dom
import type { Context } from '../index'
import { normalizeProps } from '@destyler/vanilla'
import { CalendarDate } from '@internationalized/date'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const services: Array<ReturnType<typeof machine>> = []
const first = new CalendarDate(2024, 3, 4)
const second = new CalendarDate(2024, 4, 5)
const proposed = new CalendarDate(2024, 5, 6)

beforeEach(() => vi.useFakeTimers())
afterEach(async () => {
  const errors: unknown[] = []
  try {
    await vi.runOnlyPendingTimersAsync()
  }
  catch (error) {
    errors.push(error)
  }
  finally {
    for (const service of services.splice(0)) {
      try {
        service.stop()
      }
      catch (error) {
        errors.push(error)
      }
    }
    try {
      document.body.replaceChildren()
    }
    catch (error) {
      errors.push(error)
    }
    try {
      vi.useRealTimers()
    }
    catch (error) {
      errors.push(error)
    }
  }
  if (errors.length === 1)
    throw errors[0]
  if (errors.length > 1)
    throw new AggregateError(errors, 'Calendar compatibility cleanup failed', { cause: errors[0] })
})

function setup(context: Partial<Context> = {}) {
  const service = machine({ id: 'checked-calendar-value', ...context })
  services.push(service)
  return { service, api: () => connect(service.state, service.send, normalizeProps) }
}

const initialCases: Array<{ name: string, context: Partial<Context>, expected: CalendarDate[], controlled: boolean }> = [
  { name: 'omitted values', context: {}, expected: [], controlled: false },
  { name: 'own undefined value', context: { value: undefined }, expected: [], controlled: true },
  { name: 'own undefined default', context: { defaultValue: undefined }, expected: [], controlled: false },
  { name: 'default alone', context: { defaultValue: [first] }, expected: [first], controlled: false },
  { name: 'value alone', context: { value: [second] }, expected: [second], controlled: true },
  { name: 'existing supplied value overwrite', context: { defaultValue: [first], value: [second] }, expected: [second], controlled: true },
  { name: 'default with own undefined value', context: { defaultValue: [first], value: undefined }, expected: [first], controlled: true },
  { name: 'value with undefined default', context: { defaultValue: undefined, value: [second] }, expected: [second], controlled: true },
  { name: 'both own undefined', context: { defaultValue: undefined, value: undefined }, expected: [], controlled: true },
]

describe('calendar checked value compatibility', () => {
  it.each(initialCases)('preserves public initialization and ownership for $name', ({ context, expected, controlled }) => {
    const onValueChange = vi.fn()
    const { service, api } = setup({ ...context, onValueChange })
    expect(api().value.map(date => date.toString())).toEqual(expected.map(date => date.toString()))
    expect(api().value).toBe(service.state.context.value)
    service.setContext({ value: undefined, defaultValue: undefined })
    expect(api().value.map(date => date.toString())).toEqual(expected.map(date => date.toString()))
    service.start()
    api().setValue([proposed])
    expect(onValueChange).toHaveBeenCalledOnce()
    expect(onValueChange.mock.calls[0][0].value.map((date: CalendarDate) => date.toString())).toEqual([proposed.toString()])
    expect(api().value.map(date => date.toString())).toEqual((controlled ? expected : [proposed]).map(date => date.toString()))
    service.setContext({ value: [first] })
    const synchronized = service.state.context.value
    service.setContext({ value: undefined })
    expect(service.state.context.value).toBe(synchronized)
    expect(api().value.map(date => date.toString())).toEqual([first.toString()])
    expect(onValueChange).toHaveBeenCalledOnce()
  })

  it('preserves existing value overwrite order and separately derived initial focus', () => {
    const { service, api } = setup({ defaultValue: [first], value: [proposed, second] })
    expect(api().value.map(date => date.toString())).toEqual([proposed.toString(), second.toString()])
    expect(service.state.context.focusedValue.toString()).toBe(first.toString())
  })

  it('reads the latest public context when clear trigger props are requested', () => {
    const { service, api } = setup({ defaultValue: [first] })
    const connected = api()
    expect(connected.getClearTriggerProps().hidden).toBe(false)
    service.setContext({ value: [] })
    expect(connected.getClearTriggerProps().hidden).toBe(true)
    expect(connected.value.map(date => date.toString())).toEqual([first.toString()])
  })

  it('rejects a fabricated undefined state without inventing selected dates', () => {
    const { service } = setup({ defaultValue: [first] })
    const state = service.getState()
    const invalid = { ...state, context: { ...state.context, value: undefined } }
    const send = vi.fn()
    expect(() => connect(invalid, send, normalizeProps)).toThrow(TypeError)
    expect(send).not.toHaveBeenCalled()
    expect(service.state.context.value?.map(date => date.toString())).toEqual([first.toString()])
  })

  it('keeps the watch comparator equality behavior for valid date arrays', () => {
    const { service } = setup()
    const compare = service.options.compareFns!.value!
    expect(compare([], [])).toBe(true)
    expect(compare([first], [first.copy()])).toBe(true)
    expect(compare([first], [second])).toBe(false)
    expect(compare([first], [])).toBe(false)
  })

  it('reads the first comparator length before rejecting the second input', () => {
    const { service } = setup()
    const reads: PropertyKey[] = []
    const value = new Proxy([first], {
      get(target, key, receiver) {
        reads.push(key)
        return Reflect.get(target, key, receiver)
      },
    })
    expect(() => service.options.compareFns!.value!(value, undefined)).toThrow(TypeError)
    expect(reads).toEqual(['length'])
  })

  it('rejects the first missing comparator input before reading the second', () => {
    const { service } = setup()
    const reads: PropertyKey[] = []
    const value = new Proxy([first], {
      get(target, key, receiver) {
        reads.push(key)
        return Reflect.get(target, key, receiver)
      },
    })
    expect(() => service.options.compareFns!.value!(undefined, value)).toThrow(TypeError)
    expect(reads).toEqual([])
  })
})
