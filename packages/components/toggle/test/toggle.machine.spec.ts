import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createToggle(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'toggle-test',
    ...ctx,
  } as any)
}

describe('toggle-group controllable value (Phase 3)', () => {
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
    const service = createToggle(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: ['bold'] })
    expect(service.state.context.value).toEqual(['bold'])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: ['italic'] })
    expect(service.state.context.value).toEqual(['italic'])
  })

  it('uncontrolled: neither defaultValue nor value starts empty', () => {
    const service = start({})
    expect(service.state.context.value).toEqual([])
  })

  it('uncontrolled: defaultValue preferred over value seed for initial', () => {
    const service = start({ defaultValue: ['bold'], value: ['italic'] })
    expect(service.state.context.value).toEqual(['bold'])
  })

  it('phase 3 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'TOGGLE.CLICK', value: 'bold', id: 'toggle-bold' })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['bold'] })

    service.setContext({ value: ['bold'] })
    expect(service.state.context.value).toEqual(['bold'])
  })

  it('controlled: with value presence, TOGGLE.CLICK only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      value: [],
      onValueChange,
    })
    expect(service.state.context.value).toEqual([])

    service.send({ type: 'TOGGLE.CLICK', value: 'bold', id: 'toggle-bold' })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['bold'] })

    service.setContext({ value: ['bold'] })
    expect(service.state.context.value).toEqual(['bold'])
  })

  it('controlled: multiple TOGGLE.CLICK only invokes until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({
      value: ['bold'],
      multiple: true,
      onValueChange,
    })

    service.send({ type: 'TOGGLE.CLICK', value: 'italic', id: 'toggle-italic' })
    expect(service.state.context.value).toEqual(['bold'])
    expect(onValueChange).toHaveBeenCalledWith({ value: ['bold', 'italic'] })

    service.setContext({ value: ['bold', 'italic'] })
    expect(service.state.context.value).toEqual(['bold', 'italic'])
  })

  it('connect exposes value and getItemState pressed from context', () => {
    const service = start({ value: ['bold'] })
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.value).toEqual(['bold'])
    expect(api.getItemState({ value: 'bold' }).pressed).toBe(true)
    expect(api.getItemState({ value: 'italic' }).pressed).toBe(false)
  })
})
