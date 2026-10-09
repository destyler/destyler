import type { UserDefinedContext, ValueChangeDetails } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const services: ReturnType<typeof machine>[] = []
afterEach(() => services.splice(0).reverse().forEach(service => service.stop()))

function setup(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'navigation-notifications', ...context }).start()
  services.push(service)
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

describe('navigationMenu value notification ownership', () => {
  it.each([
    { initial: null, next: 'a' },
    { initial: 'a', next: 'b' },
    { initial: 'a', next: null },
  ])('notifies uncontrolled $initial -> $next once after mutation', async ({ initial, next }) => {
    const observed: Array<string | null> = []
    let fixture: ReturnType<typeof setup>
    const onValueChange = vi.fn(() => observed.push(fixture.api().value))
    fixture = setup({ defaultValue: initial, onValueChange })
    fixture.api().setValue(next)
    expect(fixture.api().value).toBe(next)
    expect(onValueChange.mock.calls).toEqual([[{ value: next }]])
    expect(observed).toEqual([next])
    await Promise.resolve()
    expect(fixture.api().open).toBe(next !== null)
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it.each([null, 'a'])('does not notify an equal uncontrolled value %j', (value) => {
    const onValueChange = vi.fn()
    const fixture = setup({ defaultValue: value, onValueChange })
    fixture.api().setValue(value)
    fixture.api().setValue(value)
    expect(fixture.api().value).toBe(value)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('notifies an uncontrolled close once and suppresses repeated closes', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ defaultValue: 'a', onValueChange })
    fixture.service.send('CLOSE')
    fixture.service.send('CLOSE')
    expect(fixture.api().value).toBe(null)
    expect(onValueChange.mock.calls).toEqual([[{ value: null }]])
  })

  it('does not notify CLOSE on an initially closed uncontrolled menu', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ onValueChange })
    fixture.service.send('CLOSE')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('retains one notification per uncontrolled trigger click', () => {
    const onValueChange = vi.fn()
    const fixture = setup({ onValueChange })
    fixture.service.send({ type: 'TRIGGER_CLICK', value: 'a' })
    fixture.service.send({ type: 'TRIGGER_CLICK', value: 'a' })
    expect(onValueChange.mock.calls).toEqual([[{ value: 'a' }], [{ value: null }]])
  })

  it('preserves controlled vetoed requests and delayed parent acceptance without echo', async () => {
    const onValueChange = vi.fn()
    const fixture = setup({ value: null, onValueChange })
    fixture.api().setValue('a')
    fixture.api().setValue('a')
    expect(fixture.api().value).toBe(null)
    expect(onValueChange.mock.calls).toEqual([[{ value: 'a' }], [{ value: 'a' }]])
    fixture.service.setContext({ value: 'a' })
    await Promise.resolve()
    expect(fixture.api().open).toBe(true)
    fixture.service.send('CLOSE')
    expect(fixture.api().value).toBe('a')
    expect(onValueChange).toHaveBeenLastCalledWith({ value: null })
    fixture.service.setContext({ value: null })
    await Promise.resolve()
    expect(fixture.api().open).toBe(false)
    expect(onValueChange).toHaveBeenCalledTimes(3)
  })

  it('preserves immediate controlled parent acceptance with one proposal', async () => {
    let fixture: ReturnType<typeof setup>
    const onValueChange = vi.fn(({ value }: ValueChangeDetails) => fixture.service.setContext({ value }))
    fixture = setup({ value: null, onValueChange })
    fixture.api().setValue('a')
    await Promise.resolve()
    expect(fixture.api().value).toBe('a')
    expect(fixture.api().open).toBe(true)
    fixture.service.send('CLOSE')
    await Promise.resolve()
    expect(fixture.api().value).toBe(null)
    expect(fixture.api().open).toBe(false)
    expect(onValueChange.mock.calls).toEqual([[{ value: 'a' }], [{ value: null }]])
  })

  it('does not notify parent-only context synchronization', async () => {
    const onValueChange = vi.fn()
    const fixture = setup({ value: null, onValueChange })
    fixture.service.setContext({ value: 'a' })
    await Promise.resolve()
    fixture.service.setContext({ value: null })
    await Promise.resolve()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('preserves callback replacement without invoking the replacement for the same request', () => {
    const next = vi.fn()
    let fixture: ReturnType<typeof setup>
    const first = vi.fn(() => fixture.service.setContext({ onValueChange: next }))
    fixture = setup({ onValueChange: first })
    fixture.api().setValue('a')
    expect(first).toHaveBeenCalledExactlyOnceWith({ value: 'a' })
    expect(next).not.toHaveBeenCalled()
    fixture.api().setValue('b')
    expect(next).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })

  it('keeps synchronous nested uncontrolled requests distinct without duplicate reports', () => {
    let fixture: ReturnType<typeof setup>
    const onValueChange = vi.fn(({ value }: ValueChangeDetails) => {
      if (value === 'a')
        fixture.api().setValue('b')
    })
    fixture = setup({ onValueChange })
    fixture.api().setValue('a')
    expect(fixture.api().value).toBe('b')
    expect(onValueChange.mock.calls).toEqual([[{ value: 'a' }], [{ value: 'b' }]])
  })

  it('does not swallow or replace callback exceptions', () => {
    const error = new Error('consumer callback')
    const onValueChange = vi.fn(() => {
      throw error
    })
    const fixture = setup({ onValueChange })
    let caught: unknown
    try {
      fixture.api().setValue('a')
    }
    catch (value) {
      caught = value
    }
    expect(caught).toBe(error)
    expect(fixture.api().value).toBe('a')
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it('keeps frozen caller context and ownership keys unchanged', () => {
    const onValueChange = vi.fn()
    const input = Object.freeze({ id: 'frozen-context', defaultValue: 'a', onValueChange })
    const service = machine(input).start()
    services.push(service)
    connect(service.getState(), service.send, normalize).setValue('b')
    expect(input.defaultValue).toBe('a')
    expect(Reflect.ownKeys(input)).toEqual(['id', 'defaultValue', 'onValueChange'])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })
})
