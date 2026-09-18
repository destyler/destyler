import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('tooltip controllable open (Phase 3)', () => {
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
    const service = machine({
      id: 'tooltip-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultOpen true starts open', () => {
    const service = start({ defaultOpen: true })
    expect(service.state.matches('open')).toBe(true)
  })

  it('uncontrolled: defaultOpen alone does not defer transitions', () => {
    const onOpenChange = vi.fn()
    const service = start({ defaultOpen: false, onOpenChange })
    service.send('OPEN')
    expect(service.state.matches('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  })

  it('uncontrolled: neither defaultOpen nor open starts closed', () => {
    const service = start({})
    expect(service.state.matches('closed')).toBe(true)
  })

  it('phase 3 presence: open alone (no flag) — OPEN only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('closed')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('closed')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    // tooltip toggleVisibility uses queueMicrotask
    await new Promise<void>(resolve => queueMicrotask(resolve))
    expect(service.state.matches('open')).toBe(true)
  })

  it('controlled: with open presence, OPEN only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      open: false,
      onOpenChange,
    })
    expect(service.state.matches('closed')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('closed')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await new Promise<void>(resolve => queueMicrotask(resolve))
    expect(service.state.matches('open')).toBe(true)
  })
})
