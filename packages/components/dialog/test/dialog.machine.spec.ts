import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createDialog(ctx: Record<string, unknown> = {}) {
  const service = machine({
    id: 'dialog-test',
    ...ctx,
  } as any)
  return service
}

describe('dialog controllable open (Phase 1)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore activity cleanup errors in node
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createDialog(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultOpen true starts open', () => {
    const service = start({ defaultOpen: true })
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: legacy open seed true starts open (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: neither defaultOpen nor open starts closed', () => {
    const service = start({})
    expect(service.state.matches('closed')).toBe(true)
  })

  it('uncontrolled: defaultOpen preferred over open seed for initial', () => {
    const service = start({ defaultOpen: true, open: false })
    expect(service.state.matches('open')).toBe(true)
  })

  it('controlled: open.controlled required — open alone does not defer transitions', () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('closed')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  })

  it('controlled: with open.controlled, OPEN only invokes onOpenChange until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': false,
      'open.controlled': true,
      onOpenChange,
    })
    expect(service.state.matches('closed')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('closed')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })

  it('controlled: CLOSE only invokes callback until parent sets open=false', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': true,
      'open.controlled': true,
      onOpenChange,
    })
    expect(service.state.matches('open')).toBe(true)

    service.send('CLOSE')
    expect(service.state.matches('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: false })

    service.setContext({ open: false })
    await Promise.resolve()
    expect(service.state.matches('closed')).toBe(true)
  })

  it('connect setOpen still sends OPEN/CLOSE', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    expect(api.open).toBe(false)
    api.setOpen(true)
    expect(service.state.matches('open')).toBe(true)
  })
})
