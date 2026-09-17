import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createNumberInput(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'number-input-test',
    ...ctx,
  } as any)
}

describe('number-input controllable value (Phase 2)', () => {
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
    const service = createNumberInput(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: '42' })
    expect(service.state.context.value).toBe('42')
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: '7' })
    expect(service.state.context.value).toBe('7')
  })

  it('uncontrolled: neither starts empty string', () => {
    const service = start({})
    expect(service.state.context.value).toBe('')
  })

  it('uncontrolled: defaultValue preferred over value seed', () => {
    const service = start({ defaultValue: '1', value: '2' })
    expect(service.state.context.value).toBe('1')
  })

  it('phase 2 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: '0', onValueChange })
    service.send({ type: 'VALUE.SET', value: '5' })
    expect(service.state.context.value).toBe('0')
    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange.mock.calls[0][0].value).toBe('5')

    service.setContext({ value: '5' })
    expect(service.state.context.value).toBe('5')
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': '0',
      'value.controlled': false,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: '5' })
    expect(service.state.context.value).toBe('5')
    expect(onValueChange.mock.calls[0][0].value).toBe('5')
  })

  it('controlled: value.controlled defers until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': '0',
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: '9' })
    expect(service.state.context.value).toBe('0')
    expect(onValueChange.mock.calls[0][0].value).toBe('9')
    service.setContext({ value: '9' })
    expect(service.state.context.value).toBe('9')
  })

  it('connect setValue still sends VALUE.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setValue(3)
    expect(service.state.context.value).not.toBe('')
  })
})
