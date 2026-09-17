import { afterEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

describe('combobox controllable open (Phase 1)', () => {
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

  it('uncontrolled: legacy open seed true starts suggesting (compat)', () => {
    const service = start({ open: true })
    expect(service.state.matches('suggesting')).toBe(true)
  })
})

describe('combobox controllable value (Phase 1)', () => {
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

  it('legacy: VALUE.SET mutates without flag', () => {
    const onValueChange = vi.fn()
    const service = start({ value: [], onValueChange })
    service.send({ type: 'VALUE.SET', value: ['apple'] })
    expect(service.state.context.value).toEqual(['apple'])
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: ['apple'] }))
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
