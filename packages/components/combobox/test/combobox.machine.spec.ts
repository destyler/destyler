import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('combobox controllable open (Phase 2)', () => {
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
      id: 'combobox-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultOpen true starts suggesting', () => {
    const service = start({ defaultOpen: true })
    expect(service.state.matches('suggesting')).toBe(true)
  })

  it('uncontrolled: neither defaultOpen nor open starts idle', () => {
    const service = start({})
    expect(service.state.matches('idle')).toBe(true)
  })

  it('phase 2 presence: open alone (no flag) defers OPEN (idle stays idle)', () => {
    const onOpenChange = vi.fn()
    const service = start({ open: false, onOpenChange })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  })

  it('phase 2: open.controlled false — OPEN goes to interacting', () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': false,
      'open.controlled': false,
      onOpenChange,
    })
    service.send('OPEN')
    expect(service.state.matches('interacting')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })
  })

  it('controlled: with open.controlled, OPEN only invokes until parent syncs', async () => {
    const onOpenChange = vi.fn()
    const service = start({
      'open': false,
      'open.controlled': true,
      onOpenChange,
    })
    expect(service.state.matches('idle')).toBe(true)

    service.send('OPEN')
    expect(service.state.matches('idle')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith({ open: true })

    service.setContext({ open: true })
    await Promise.resolve()
    // CONTROLLED.OPEN from idle targets interacting
    expect(service.state.matches('interacting')).toBe(true)
  })
})

describe('combobox controllable value (Phase 2)', () => {
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
      id: 'combobox-value-test',
      ...ctx,
    } as any)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultValue seeds value', () => {
    const service = start({ defaultValue: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('uncontrolled: legacy value seed (compat)', () => {
    const service = start({ value: ['banana'] })
    expect(service.state.context.value).toEqual(['banana'])
  })

  it('uncontrolled: defaultInputValue seeds inputValue', () => {
    const service = start({ defaultInputValue: 'hello' })
    expect(service.state.context.inputValue).toBe('hello')
  })

  it('uncontrolled: legacy inputValue seed (compat)', () => {
    const service = start({ inputValue: 'world' })
    expect(service.state.context.inputValue).toBe('world')
  })

  it('phase 2 presence: value alone (no flag) defers mutation until parent syncs', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))

    service.setContext({ value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('phase 2: value.controlled false overrides presence (legacy seed escape)', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': false,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))
  })

  it('phase 2 presence: inputValue alone (no flag) defers INPUT_VALUE.SET', () => {
    const onInputValueChange = vi.fn()
    const service = start({ inputValue: '', onInputValueChange })
    service.send({ type: 'INPUT_VALUE.SET', value: 'typed' })
    expect(service.state.context.inputValue).toBe('')
    expect(onInputValueChange).toHaveBeenCalledWith({ inputValue: 'typed' })

    service.setContext({ inputValue: 'typed' })
    expect(service.state.context.inputValue).toBe('typed')
  })

  it('controlled: value.controlled defers VALUE.SET until setContext', () => {
    const onValueChange = vi.fn()
    const service = start({
      'value': [],
      'value.controlled': true,
      onValueChange,
    })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual([])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))
    service.setContext({ value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
  })

  it('controlled: inputValue.controlled defers INPUT_VALUE.SET until setContext', () => {
    const onInputValueChange = vi.fn()
    const service = start({
      'inputValue': '',
      'inputValue.controlled': true,
      onInputValueChange,
    })
    service.send({ type: 'INPUT_VALUE.SET', value: 'typed' })
    expect(service.state.context.inputValue).toBe('')
    expect(onInputValueChange).toHaveBeenCalledWith({ inputValue: 'typed' })
    service.setContext({ inputValue: 'typed' })
    expect(service.state.context.inputValue).toBe('typed')
  })
})
