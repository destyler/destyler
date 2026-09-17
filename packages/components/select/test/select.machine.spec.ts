import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('select controllable open (Phase 1)', () => {
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

  it('uncontrolled: legacy open seed true starts open (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('open')).toBe(true)
  })
})

describe('select controllable value (Phase 1)', () => {
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

  it('legacy: value alone still mutates on VALUE.SET (no defer)', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
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
