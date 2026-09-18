import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createSlider(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'slider-test',
    ...ctx,
  } as any)
}

describe('slider controllable value (Phase 3)', () => {
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
    const service = createSlider(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: [25] })
    expect(service.state.context.value).toEqual([25])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: [40] })
    expect(service.state.context.value).toEqual([40])
  })

  it('uncontrolled: neither starts [0]', () => {
    const service = start({})
    expect(service.state.context.value).toEqual([0])
  })

  it('uncontrolled: defaultValue preferred over value seed', () => {
    const service = start({ defaultValue: [10], value: [90] })
    expect(service.state.context.value).toEqual([10])
  })

  it('phase 3 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [0], onValueChange })
    service.send({ type: 'SET_VALUE', value: [50] })
    expect(service.state.context.value).toEqual([0])
    expect(onValueChange).toHaveBeenCalledWith({ value: [50] })

    service.setContext({ value: [50] })
    expect(service.state.context.value).toEqual([50])
  })

  it('controlled: value presence defers until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      value: [0],
      onValueChange,
    })
    service.send({ type: 'SET_VALUE', value: [75] })
    expect(service.state.context.value).toEqual([0])
    expect(onValueChange).toHaveBeenCalledWith({ value: [75] })
    service.setContext({ value: [75] })
    expect(service.state.context.value).toEqual([75])
  })

  it('connect setValue still sends SET_VALUE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setValue([33])
    expect(service.state.context.value).toEqual([33])
  })
})
