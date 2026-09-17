import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createCollapse(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'collapse-test',
    ...ctx,
  } as any)
}

describe('collapse controllable value (Phase 1)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore activity cleanup errors
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createCollapse(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: ['item-a'] })
    expect(service.state.context.value).toEqual(['item-a'])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: ['item-b'] })
    expect(service.state.context.value).toEqual(['item-b'])
  })

  it('uncontrolled: neither defaultValue nor value starts empty', () => {
    const service = start({})
    expect(service.state.context.value).toEqual([])
  })

  it('uncontrolled: defaultValue preferred over value seed for initial', () => {
    const service = start({ defaultValue: ['item-a'], value: ['item-b'] })
    expect(service.state.context.value).toEqual(['item-a'])
  })

  it('legacy: value alone still mutates on VALUE.SET (no defer)', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: ['item-a'] })
    expect(service.state.context.value).toEqual(['item-a'])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['item-a'] })
  })

  it('controlled: with value.controlled, VALUE.SET only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': true,
      onValueChange,
    })
    expect(service.state.context.value).toEqual([])

    service.send({ type: 'VALUE.SET', value: ['item-a'] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['item-a'] })

    service.setContext({ value: ['item-a'] })
    expect(service.state.context.value).toEqual(['item-a'])
  })

  it('controlled: TRIGGER.CLICK expand only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'collapsible': true,
      'value.controlled': true,
      onValueChange,
    })

    service.send({ type: 'TRIGGER.FOCUS', value: 'item-a' })
    service.send({ type: 'TRIGGER.CLICK', value: 'item-a' })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['item-a'] })

    service.setContext({ value: ['item-a'] })
    expect(service.state.context.value).toEqual(['item-a'])
  })

  it('connect setValue still sends VALUE.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.value).toEqual([])
    api.setValue(['item-a'])
    expect(service.state.context.value).toEqual(['item-a'])
  })
})
