import { CalendarDate } from '@internationalized/date'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('calendar controllable open (Phase 1)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore activity cleanup errors in node
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = machine({
      id: 'calendar-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultOpen true starts open', () => {
    const service = start({ defaultOpen: true })
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: neither defaultOpen nor open starts idle', () => {
    const service = start({})
    expect(service.state.matches('idle')).toBe(true)
  })

  it('uncontrolled: legacy open seed true starts open (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('open')).toBe(true)
  })
})

describe('calendar controllable value (Phase 1)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = machine({
      id: 'calendar-value-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  const d1 = new CalendarDate(2024, 1, 15)
  const d2 = new CalendarDate(2024, 2, 20)

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: [d1] })
    expect(service.state.context.value).toHaveLength(1)
    expect(service.state.context.value[0].toString()).toBe(d1.toString())
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: [d2] })
    expect(service.state.context.value[0].toString()).toBe(d2.toString())
  })

  it('legacy: VALUE.SET mutates without flag', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: [d1] })
    expect(service.state.context.value).toHaveLength(1)
    expect(onValueChange).toHaveBeenCalled()
  })

  it('controlled: value.controlled defers VALUE.SET until setContext', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: [d1] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({
      value: expect.arrayContaining([expect.objectContaining({ day: 15 })]),
    }))
    service.setContext({ value: [d1] })
    expect(service.state.context.value).toHaveLength(1)
  })
})
