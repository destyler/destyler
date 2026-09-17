import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createSwitch(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'switch-test',
    ...ctx,
  } as any)
}

describe('switch controllable checked (Phase 2)', () => {
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
    const service = createSwitch(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultChecked true seeds checked', () => {
    const service = start({ defaultChecked: true })
    expect(service.state.context.checked).toBe(true)
  })

  it('uncontrolled: legacy checked seed true (compat)', () => {
    const service = start({ checked: true })
    expect(service.state.context.checked).toBe(true)
  })

  it('uncontrolled: neither defaultChecked nor checked starts false', () => {
    const service = start({})
    expect(service.state.context.checked).toBe(false)
  })

  it('uncontrolled: defaultChecked preferred over checked seed for initial', () => {
    const service = start({
      'defaultChecked': true,
      'checked': false,
      'checked.controlled': false,
    })
    expect(service.state.context.checked).toBe(true)
  })

  it('phase 2 presence: checked alone (no flag) defers mutation until parent syncs', () => {
    const onCheckedChange = vi.fn()
    const service = start({ checked: false, onCheckedChange })
    service.send({ type: 'CHECKED.TOGGLE', isTrusted: false })
    expect(service.state.context.checked).toBe(false)
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: true })

    service.setContext({ checked: true })
    expect(service.state.context.checked).toBe(true)
  })

  it('phase 2: checked.controlled false overrides presence (legacy seed escape)', () => {
    const onCheckedChange = vi.fn()
    const service = start({
      'checked': false,
      'checked.controlled': false,
      onCheckedChange,
    })
    service.send({ type: 'CHECKED.TOGGLE', isTrusted: false })
    expect(service.state.context.checked).toBe(true)
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: true })
  })

  it('controlled: with checked.controlled, toggle only invokes until parent syncs', () => {
    const onCheckedChange = vi.fn()
    const service = start({
      'checked': false,
      'checked.controlled': true,
      onCheckedChange,
    })
    expect(service.state.context.checked).toBe(false)

    service.send({ type: 'CHECKED.TOGGLE', isTrusted: false })
    expect(service.state.context.checked).toBe(false)
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: true })

    service.setContext({ checked: true })
    expect(service.state.context.checked).toBe(true)
  })

  it('controlled: CHECKED.SET only invokes callback until parent syncs', () => {
    const onCheckedChange = vi.fn()
    const service = start({
      'checked': true,
      'checked.controlled': true,
      onCheckedChange,
    })

    service.send({ type: 'CHECKED.SET', checked: false, isTrusted: false })
    expect(service.state.context.checked).toBe(true)
    expect(onCheckedChange).toHaveBeenCalledWith({ checked: false })

    service.setContext({ checked: false })
    expect(service.state.context.checked).toBe(false)
  })

  it('connect toggleChecked still sends CHECKED.TOGGLE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.checked).toBe(false)
    api.toggleChecked()
    expect(service.state.context.checked).toBe(true)
  })
})
