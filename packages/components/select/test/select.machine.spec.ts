import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('select controllable open (Phase 2)', () => {
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
      id: 'select-test',
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
    // select closes to focused (not idle)
    expect(service.state.matches('focused')).toBe(true)
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

describe('select controllable value (Phase 2)', () => {
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
      id: 'select-value-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: ['banana'] })
    expect(service.state.context.value).toEqual(['banana'])
  })

  it('uncontrolled: neither defaultValue nor value starts empty', () => {
    const service = start({})
    expect(service.state.context.value).toEqual([])
  })

  it('uncontrolled: defaultValue preferred over value seed for initial', () => {
    const service = start({ defaultValue: ['apple'], value: ['banana'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('phase 2 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))

    service.setContext({ value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': false,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))
  })

  it('controlled: with value.controlled, VALUE.SET only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': true,
      onValueChange,
    })
    expect(service.state.context.value).toEqual([])

    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))

    service.setContext({ value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })
})
