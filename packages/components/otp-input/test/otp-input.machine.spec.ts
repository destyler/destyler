import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createOtp(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'otp-input-test',
    ...ctx,
  } as any)
}

describe('otp-input controllable value (Phase 1)', () => {
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
    const service = createOtp(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: ['1', '2', '3', '4'] })
    expect(service.state.context.value).toEqual(['1', '2', '3', '4'])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: ['9', '8'] })
    expect(service.state.context.value).toEqual(['9', '8'])
  })

  it('uncontrolled: neither starts empty array', () => {
    const service = start({})
    expect(service.state.context.value).toEqual([])
  })

  it('uncontrolled: defaultValue preferred over value seed', () => {
    const service = start({ defaultValue: ['a'], value: ['b'] })
    expect(service.state.context.value).toEqual(['a'])
  })

  it('legacy: value alone still mutates on VALUE.SET', () => {
    const onValueChange = vi.fn()
    const service = start({ value: ['', '', '', ''], onValueChange })
    service.send({ type: 'VALUE.SET', value: ['1', '2', '3', '4'] })
    expect(service.state.context.value).toEqual(['1', '2', '3', '4'])
    expect(onValueChange).toHaveBeenCalled()
  })

  it('controlled: value.controlled defers until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': ['', '', '', ''],
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: ['1', '2', '3', '4'] })
    expect(service.state.context.value).toEqual(['', '', '', ''])
    expect(onValueChange).toHaveBeenCalledWith({
      value: ['1', '2', '3', '4'],
      valueAsString: '1234',
    })
    service.setContext({ value: ['1', '2', '3', '4'] })
    expect(service.state.context.value).toEqual(['1', '2', '3', '4'])
  })

  it('connect setValue still sends VALUE.SET', () => {
    const service = start({ value: ['', '', '', ''] })
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setValue(['5', '6', '7', '8'])
    expect(service.state.context.value).toEqual(['5', '6', '7', '8'])
  })
})
