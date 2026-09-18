import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('hover-card controllable open (Phase 3)', () => {
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
      id: 'hover-card-test',
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

  it('uncontrolled: neither defaultOpen nor open starts closed', () => {
    const service = start({})
    expect(service.state.matches('closed')).toBe(true)
  })

  it('uncontrolled: defaultOpen preferred over open for initial seed', () => {
    const service = start({ defaultOpen: true })
    expect(service.state.matches('open')).toBe(true)
  })

  it('phase 3 presence: open alone (no flag) — OPEN only invokes (stays in opening, not open)', () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('closed')).toBe(true)

    service.send('OPEN')
    // hover-card routes OPEN -> opening; controlled path invokes on delay
    expect(service.state.matches('opening')).toBe(true)
    expect(service.state.matches('open')).toBe(false)
  })


  it('controlled: with open presence, CLOSE from open only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': true,
      onOpenChange,
    })
    expect(service.state.matches('open')).toBe(true)

    service.send('CLOSE')
    expect(service.state.matches('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: false })

    service.setContext({ open: false })
    await Promise.resolve()
    await Promise.resolve()
    expect(service.state.matches('closed')).toBe(true)
  })
})
