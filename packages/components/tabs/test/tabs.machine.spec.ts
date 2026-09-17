import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createTabs(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'tabs-test',
    ...ctx,
  } as any)
}

describe('tabs controllable value (Phase 1)', () => {
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
    const service = createTabs(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: 'tab-a' })
    expect(service.state.context.value).toBe('tab-a')
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: 'tab-b' })
    expect(service.state.context.value).toBe('tab-b')
  })

  it('uncontrolled: neither defaultValue nor value starts null', () => {
    const service = start({})
    expect(service.state.context.value).toBe(null)
  })

  it('uncontrolled: defaultValue preferred over value seed for initial', () => {
    const service = start({ defaultValue: 'tab-a', value: 'tab-b' })
    expect(service.state.context.value).toBe('tab-a')
  })

  it('legacy: value alone still mutates on SET_VALUE (no defer)', () => {
    const onValueChange = vi.fn()
    const service = start({ value: null, onValueChange })
    service.send({ type: 'SET_VALUE', value: 'tab-a' })
    expect(service.state.context.value).toBe('tab-a')
    expect(onValueChange).toHaveBeenCalledWith({ value: 'tab-a' })
  })

  it('controlled: with value.controlled, SET_VALUE only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': null,
      'value.controlled': true,
      onValueChange,
    })
    expect(service.state.context.value).toBe(null)

    service.send({ type: 'SET_VALUE', value: 'tab-a' })
    expect(service.state.context.value).toBe(null)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'tab-a' })

    service.setContext({ value: 'tab-a' })
    expect(service.state.context.value).toBe('tab-a')
  })

  it('controlled: TAB_CLICK only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': 'tab-a',
      'value.controlled': true,
      onValueChange,
    })

    service.send({ type: 'TAB_CLICK', value: 'tab-b' })
    expect(service.state.context.value).toBe('tab-a')
    expect(onValueChange).toHaveBeenCalledWith({ value: 'tab-b' })

    service.setContext({ value: 'tab-b' })
    expect(service.state.context.value).toBe('tab-b')
  })

  it('connect setValue still sends SET_VALUE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.value).toBe(null)
    api.setValue('tab-a')
    expect(service.state.context.value).toBe('tab-a')
  })
})
