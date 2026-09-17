import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createEdit(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'edit-test',
    ...ctx,
  } as any)
}

describe('edit controllable value (Phase 2)', () => {
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
    const service = createEdit(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: 'hello' })
    expect(service.state.context.value).toBe('hello')
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: 'world' })
    expect(service.state.context.value).toBe('world')
  })

  it('uncontrolled: neither starts empty string', () => {
    const service = start({})
    expect(service.state.context.value).toBe('')
  })

  it('uncontrolled: defaultValue preferred over value seed', () => {
    const service = start({ defaultValue: 'a', value: 'b' })
    expect(service.state.context.value).toBe('a')
  })

  it('phase 2 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: '', onValueChange })
    service.send({ type: 'VALUE.SET', value: 'x' })
    expect(service.state.context.value).toBe('')
    expect(onValueChange).toHaveBeenCalledWith({ value: 'x' })

    service.setContext({ value: 'x' })
    expect(service.state.context.value).toBe('x')
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': '',
      'value.controlled': false,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: 'x' })
    expect(service.state.context.value).toBe('x')
    expect(onValueChange).toHaveBeenCalledWith({ value: 'x' })
  })

  it('controlled: value.controlled defers until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': 'old',
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: 'new' })
    expect(service.state.context.value).toBe('old')
    expect(onValueChange).toHaveBeenCalledWith({ value: 'new' })
    service.setContext({ value: 'new' })
    expect(service.state.context.value).toBe('new')
  })

  it('connect setValue still sends VALUE.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setValue('via-api')
    expect(service.state.context.value).toBe('via-api')
  })
})
