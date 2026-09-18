import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createRadio(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'radio-test',
    ...ctx,
  } as any)
}

describe('radio controllable value (Phase 3)', () => {
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
    const service = createRadio(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: 'apple' })
    expect(service.state.context.value).toBe('apple')
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: 'banana' })
    expect(service.state.context.value).toBe('banana')
  })

  it('uncontrolled: neither defaultValue nor value starts null', () => {
    const service = start({})
    expect(service.state.context.value).toBe(null)
  })

  it('uncontrolled: defaultValue preferred over value seed for initial', () => {
    const service = start({ defaultValue: 'apple', value: 'banana' })
    expect(service.state.context.value).toBe('apple')
  })

  it('phase 3 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: null, onValueChange })
    service.send({ type: 'SET_VALUE', value: 'apple', isTrusted: false })
    expect(service.state.context.value).toBe(null)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'apple' })

    service.setContext({ value: 'apple' })
    expect(service.state.context.value).toBe('apple')
  })


  it('controlled: with value presence, SET_VALUE only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': null,
      onValueChange,
    })
    expect(service.state.context.value).toBe(null)

    service.send({ type: 'SET_VALUE', value: 'apple', isTrusted: false })
    expect(service.state.context.value).toBe(null)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'apple' })

    service.setContext({ value: 'apple' })
    expect(service.state.context.value).toBe('apple')
  })

  it('connect setValue still sends SET_VALUE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.value).toBe(null)
    api.setValue('apple')
    expect(service.state.context.value).toBe('apple')
  })
})
