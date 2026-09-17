import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createNav(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'navigation-menu-test',
    ...ctx,
  } as any)
}

describe('navigation-menu controllable value (Phase 2)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore timer cleanup errors
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createNav(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value and starts open', () => {
    const service = start({ defaultValue: 'getting-started' })
    expect(service.state.context.value).toBe('getting-started')
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: legacy value seed (compat) starts open', () => {
    const service = start({ value: 'components' })
    expect(service.state.context.value).toBe('components')
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: neither defaultValue nor value starts idle/null', () => {
    const service = start({})
    expect(service.state.context.value).toBe(null)
    expect(service.state.matches('idle')).toBe(true)
  })

  it('uncontrolled: defaultValue preferred over value for initial seed', () => {
    const service = start({
      'defaultValue': 'getting-started',
      'value': 'components',
      'value.controlled': false,
    })
    expect(service.state.context.value).toBe('getting-started')
  })

  it('phase 2 presence: value alone (no flag) defers mutation until parent syncs', async () => {
    const onValueChange = vi.fn()
    const service = start({ value: null, onValueChange })
    expect(service.state.matches('idle')).toBe(true)

    service.send({ type: 'TRIGGER_CLICK', value: 'getting-started' })
    expect(service.state.context.value).toBe(null)
    expect(service.state.matches('idle')).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'getting-started' })

    service.setContext({ value: 'getting-started' })
    await Promise.resolve()
    expect(service.state.context.value).toBe('getting-started')
    expect(service.state.matches('open')).toBe(true)
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': null,
      'value.controlled': false,
      onValueChange,
    })
    service.send({ type: 'TRIGGER_CLICK', value: 'components' })
    expect(service.state.context.value).toBe('components')
    expect(service.state.matches('open')).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'components' })
  })

  it('controlled: value.controlled defers until parent syncs', async () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': null,
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'TRIGGER_CLICK', value: 'docs' })
    expect(service.state.context.value).toBe(null)
    expect(service.state.matches('idle')).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith({ value: 'docs' })

    service.setContext({ value: 'docs' })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })

  it('controlled: CLOSE only invokes until parent clears value', async () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': 'getting-started',
      'value.controlled': true,
      onValueChange,
    })
    expect(service.state.matches('open')).toBe(true)

    service.send({ type: 'CLOSE' })
    expect(service.state.matches('open')).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith({ value: null })

    service.setContext({ value: null })
    await Promise.resolve()
    expect(service.state.matches('idle')).toBe(true)
  })

  it('connect setValue still sends VALUE.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setValue('getting-started')
    expect(service.state.context.value).toBe('getting-started')
  })
})
