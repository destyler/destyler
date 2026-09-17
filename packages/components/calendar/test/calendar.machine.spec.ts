import { CalendarDate } from '@internationalized/date'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('calendar controllable open (Phase 2)', () => {
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

  it('phase 2 presence: open alone (no flag) defers transitions', async () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })

  it('phase 2: open.controlled false overrides presence (legacy seed escape)', () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': true,
      'open.controlled': false,
      onOpenChange,
    })
    expect(service.state.matches('open')).toBe(true)

    service.send('CLOSE')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: false })
  })

  it('controlled: with open.controlled, OPEN only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': false,
      'open.controlled': true,
      onOpenChange,
    })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })
})

describe('calendar controllable value (Phase 2)', () => {
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

  it('phase 2 presence: value alone (no flag) defers VALUE.SET until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: [d1] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalled()

    service.setContext({ value: [d1] })
    expect(service.state.context.value).toHaveLength(1)
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': false,
      onValueChange,
    })
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
