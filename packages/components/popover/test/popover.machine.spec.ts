import { afterEach, describe, expect, it } from 'vitest'
import { machine } from '../src/machine'

describe('popover controllable open (Phase 1)', () => {
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
      id: 'popover-test',
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

  it('uncontrolled: legacy open seed true starts open (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('open')).toBe(true)
  })
})
