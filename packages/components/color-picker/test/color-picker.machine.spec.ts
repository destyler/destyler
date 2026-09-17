import { parseColor } from '@destyler/color'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('color-picker controllable open (Phase 1)', () => {
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

  it('uncontrolled: legacy open seed true starts open (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('open')).toBe(true)
  })
})

describe('color-picker controllable value (Phase 1)', () => {
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

  it('legacy: VALUE.SET mutates without flag', () => {
    const onValueChange = vi.fn()
    const service = start({ value: parseColor('#000000'), onValueChange })
    service.send({ type: 'VALUE.SET', value: red })
    expect(service.state.context.value.toString('hex')).toBe(red.toString('hex'))
    expect(onValueChange).toHaveBeenCalled()
  })

  it('controlled: value.controlled defers VALUE.SET until setContext', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': parseColor('#000000'),
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: red })
    expect(service.state.context.value.toString('hex')).toBe('#000000')
    expect(onValueChange).toHaveBeenCalled()
    service.setContext({ value: red })
    expect(service.state.context.value.toString('hex')).toBe(red.toString('hex'))
  })
})
