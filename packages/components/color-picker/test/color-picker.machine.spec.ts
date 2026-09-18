import { parseColor } from '@destyler/color'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('color-picker controllable open (Phase 3)', () => {
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
      id: 'color-picker-test',
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

  it('uncontrolled: neither defaultOpen nor open starts idle', () => {
    const service = start({})
    expect(service.state.matches('idle')).toBe(true)
  })

  it('phase 3 presence: open alone (no flag) defers transitions', async () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })

  it('controlled: with open presence, OPEN only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      open: false,
      onOpenChange,
    })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
  })
})

describe('color-picker controllable value (Phase 3)', () => {
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
    const service = machine({
      id: 'color-picker-value-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  const red = parseColor('#ff0000')
  const blue = parseColor('#0000ff')

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: red })
    expect(service.state.context.value.toString('hex')).toBe(red.toString('hex'))
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: blue })
    expect(service.state.context.value.toString('hex')).toBe(blue.toString('hex'))
  })

  it('phase 3 presence: value alone (no flag) defers VALUE.SET until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: parseColor('#000000'), onValueChange })
    service.send({ type: 'VALUE.SET', value: red })
    expect(service.state.context.value.toString('hex')).toBe('#000000')
    expect(onValueChange).toHaveBeenCalled()

    service.setContext({ value: red })
    expect(service.state.context.value.toString('hex')).toBe(red.toString('hex'))
  })

  it('controlled: value presence defers VALUE.SET until setContext', () => {
    const onValueChange = vi.fn()
    const service = start({
      value: parseColor('#000000'),
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: red })
    expect(service.state.context.value.toString('hex')).toBe('#000000')
    expect(onValueChange).toHaveBeenCalled()
    service.setContext({ value: red })
    expect(service.state.context.value.toString('hex')).toBe(red.toString('hex'))
  })
})
