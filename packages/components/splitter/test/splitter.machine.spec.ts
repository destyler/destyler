import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const defaultPanels = [
  { id: 'a', size: 50 },
  { id: 'b', size: 50 },
]

function createSplitter(ctx: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = { id: 'splitter-test' }
  if (!('size' in ctx) && !('defaultSize' in ctx))
    base.defaultSize = defaultPanels
  return machine({
    ...base,
    ...ctx,
  } as any)
}

describe('splitter controllable size (Phase 2)', () => {
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
    const service = createSplitter(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultSize seeds size', () => {
    const service = start({
      defaultSize: [
        { id: 'a', size: 30 },
        { id: 'b', size: 70 },
      ],
    })
    expect(service.state.context.size).toEqual([
      { id: 'a', size: 30 },
      { id: 'b', size: 70 },
    ])
  })

  it('uncontrolled: legacy size seed (compat)', () => {
    const service = start({
      size: [
        { id: 'a', size: 40 },
        { id: 'b', size: 60 },
      ],
    })
    expect(service.state.context.size.map((p: any) => p.size)).toEqual([40, 60])
  })

  it('uncontrolled: defaultSize preferred over size seed', () => {
    const service = start({
      defaultSize: [
        { id: 'a', size: 20 },
        { id: 'b', size: 80 },
      ],
      size: [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
    })
    expect(service.state.context.size.map((p: any) => p.size)).toEqual([20, 80])
  })

  it('phase 2 presence: size alone (no flag) defers mutation until parent syncs', () => {
    const onSizeChange = vi.fn()
    const service = start({
      size: [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
      onSizeChange,
    })
    service.send({ type: 'SET_PANEL_SIZE', id: 'a', size: 25 })
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(50)
    expect(onSizeChange).toHaveBeenCalled()
    const details = onSizeChange.mock.calls[0][0]
    expect(details.size.find((p: any) => p.id === 'a')?.size).toBe(25)

    service.setContext({
      size: [
        { id: 'a', size: 25 },
        { id: 'b', size: 75 },
      ],
    })
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(25)
  })

  it('phase 2: size.controlled false overrides presence (legacy seed escape)', () => {
    const onSizeChange = vi.fn()
    const service = start({
      'size': [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
      'size.controlled': false,
      onSizeChange,
    })
    service.send({ type: 'SET_PANEL_SIZE', id: 'a', size: 25 })
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(25)
    expect(onSizeChange).toHaveBeenCalled()
  })

  it('controlled: size.controlled defers until parent syncs', () => {
    const onSizeChange = vi.fn()
    const service = start({
      'size': [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
      'size.controlled': true,
      onSizeChange,
    })
    service.send({ type: 'SET_PANEL_SIZE', id: 'a', size: 30 })
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(50)
    expect(onSizeChange).toHaveBeenCalled()
    const details = onSizeChange.mock.calls[0][0]
    expect(details.size.find((p: any) => p.id === 'a')?.size).toBe(30)
    service.setContext({
      size: [
        { id: 'a', size: 30 },
        { id: 'b', size: 70 },
      ],
    })
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(30)
  })

  it('connect setSize still sends SET_PANEL_SIZE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setSize('a', 35)
    expect(service.state.context.size.find((p: any) => p.id === 'a')?.size).toBe(35)
  })
})
