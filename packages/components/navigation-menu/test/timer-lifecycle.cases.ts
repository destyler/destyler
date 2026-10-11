import type { UserDefinedContext } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const extraCleanups: VoidFunction[] = []
afterEach(() => {
  services.splice(0).reverse().forEach(service => service.stop())
  extraCleanups.splice(0).forEach(cleanup => cleanup())
  // Restore spies while the fake clock still owns its functions, then restore the platform.
  vi.restoreAllMocks()
  if (vi.isFakeTimers()) {
    vi.clearAllTimers()
    vi.useRealTimers()
  }
})

function start(context: Partial<UserDefinedContext> = {}) {
  const onValueChange = vi.fn()
  const service = machine({ id: 'navigation-timer-owner', openDelay: 30, closeDelay: 50, ...context, onValueChange }).start()
  services.push(service)
  return { service, onValueChange }
}

describe('NavigationMenu delayed work ownership', () => {
  beforeEach(() => vi.useFakeTimers())

  it.each([false, true])('cancels a pending open timer on stop (controlled=%s)', async (controlled) => {
    const { service, onValueChange } = start(controlled ? { value: null } : {})
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    expect(vi.getTimerCount()).toBe(1)
    service.stop()
    expect(vi.getTimerCount()).toBe(0)
    expect(service.getState().context.openTimer).toBe(null)
    await vi.advanceTimersByTimeAsync(100)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(service.getState().context.value).toBe(null)
  })

  it.each([false, true])('cancels a pending close timer on stop (controlled=%s)', async (controlled) => {
    const { service, onValueChange } = start(controlled ? { value: 'a' } : { defaultValue: 'a' })
    service.send({ type: 'TRIGGER_LEAVE', value: 'a' })
    expect(vi.getTimerCount()).toBe(1)
    service.stop()
    expect(vi.getTimerCount()).toBe(0)
    expect(service.getState().context.closeTimer).toBe(null)
    await vi.advanceTimersByTimeAsync(100)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(service.getState().context.value).toBe('a')
  })

  it('cancels both outstanding timer kinds in one teardown', () => {
    const { service } = start({ defaultValue: 'a' })
    service.send({ type: 'TRIGGER_ENTER', value: 'b' })
    service.send({ type: 'TRIGGER_LEAVE', value: 'b' })
    expect(vi.getTimerCount()).toBe(2)
    service.stop()
    expect(vi.getTimerCount()).toBe(0)
    expect(service.getState().context).toMatchObject({ openTimer: null, closeTimer: null, value: 'a' })
  })

  it('keeps timers owned by another instance with the same public id', async () => {
    const first = start({ defaultValue: 'a' })
    const second = start()
    first.service.send({ type: 'TRIGGER_LEAVE', value: 'a' })
    second.service.send({ type: 'TRIGGER_ENTER', value: 'b' })
    first.service.stop()
    expect(vi.getTimerCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(30)
    expect(second.service.getState().context.value).toBe('b')
    expect(second.onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
    expect(first.onValueChange).not.toHaveBeenCalled()
  })

  it('clears the owned handle once across repeated stops', () => {
    const { service } = start()
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    service.stop()
    service.stop()
    expect(clear).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves sustained hover opening and delayed leave closing while running', async () => {
    const { service, onValueChange } = start()
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    await vi.advanceTimersByTimeAsync(29)
    expect(service.getState().context.value).toBe(null)
    await vi.advanceTimersByTimeAsync(1)
    expect(service.getState().context.value).toBe('a')
    service.send({ type: 'TRIGGER_LEAVE', value: 'a' })
    await vi.advanceTimersByTimeAsync(49)
    expect(service.getState().context.value).toBe('a')
    await vi.advanceTimersByTimeAsync(1)
    expect(service.getState().context.value).toBe(null)
    expect(onValueChange.mock.calls).toEqual([[{ value: 'a' }], [{ value: null }]])
  })

  it('preserves cancellation of an older pending hover when another trigger enters', async () => {
    const { service, onValueChange } = start()
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    await vi.advanceTimersByTimeAsync(10)
    service.send({ type: 'TRIGGER_ENTER', value: 'b' })
    expect(vi.getTimerCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(29)
    expect(onValueChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })

  it('does not create work when the corresponding pointer interaction is disabled', () => {
    const hover = start({ disableHoverTrigger: true })
    const leave = start({ defaultValue: 'a', disablePointerLeaveClose: true })
    hover.service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    leave.service.send({ type: 'TRIGGER_LEAVE', value: 'a' })
    expect(vi.getTimerCount()).toBe(0)
    hover.service.stop()
    leave.service.stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('preserves a numeric zero timer id without treating it as an object reference', () => {
    // Simulate the browser return shape under Node's object-handle typings.
    const schedule = vi.spyOn(globalThis, 'setTimeout').mockReturnValue(0 as unknown as ReturnType<typeof setTimeout>)
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const { service } = start()
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    expect(service.state.context.openTimer).toBe(0)
    service.stop()
    expect(clear).toHaveBeenCalledExactlyOnceWith(0)
    expect(service.state.context.openTimer).toBe(null)
    schedule.mockRestore()
  })

  it('keeps construction and stop-before-start timer-free', () => {
    const schedule = vi.spyOn(globalThis, 'setTimeout')
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const service = machine({ id: 'server-construction', defaultValue: 'a' })
    services.push(service)
    expect(service.getState().context.value).toBe('a')
    service.stop()
    expect(schedule).not.toHaveBeenCalled()
    expect(clear).not.toHaveBeenCalled()
  })

  it('can schedule fresh work after restart without reviving the old pending request', async () => {
    const { service, onValueChange } = start()
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    service.stop()
    expect(vi.getTimerCount()).toBe(0)
    service.start()
    service.send({ type: 'TRIGGER_ENTER', value: 'b' })
    await vi.advanceTimersByTimeAsync(30)
    expect(service.getState().context.value).toBe('b')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })
})

const platformTimerFunction = globalThis.setTimeout
const platformClearFunction = globalThis.clearTimeout
const platformSetTimeout = platformTimerFunction.bind(globalThis)
const platformWait = (ms: number) => new Promise<void>(resolve => platformSetTimeout(resolve, ms))

describe('NavigationMenu actual platform timer handles', () => {
  beforeEach(() => {
    expect(globalThis.setTimeout).toBe(platformTimerFunction)
    expect(globalThis.clearTimeout).toBe(platformClearFunction)
  })

  it.each(['open', 'close'] as const)('cancels a real %s timer through its stored handle', async (kind) => {
    const schedule = vi.spyOn(globalThis, 'setTimeout')
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const { service } = start({ defaultValue: kind === 'close' ? 'a' : null, openDelay: 10, closeDelay: 10 })
    const dispatch = vi.spyOn(service, 'send')
    service.send({ type: kind === 'open' ? 'TRIGGER_ENTER' : 'TRIGGER_LEAVE', value: 'a' })
    expect(schedule).toHaveBeenCalledTimes(1)
    const result = schedule.mock.results[0]
    expect(result.type).toBe('return')
    const handle = result.value
    extraCleanups.push(() => clearTimeout(handle))
    const stored = service.state.context[kind === 'open' ? 'openTimer' : 'closeTimer']
    expect(stored).toBe(handle)
    service.stop()
    expect(clear.mock.calls.some(([value]) => value === stored)).toBe(true)
    expect(service.getState().context[kind === 'open' ? 'openTimer' : 'closeTimer']).toBe(null)
    await platformWait(30)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('cancels a superseded real hover timer without delivering its stale value', async () => {
    const schedule = vi.spyOn(globalThis, 'setTimeout')
    const { service, onValueChange } = start({ openDelay: 10 })
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    service.send({ type: 'TRIGGER_ENTER', value: 'b' })
    for (const result of schedule.mock.results) {
      if (result.type === 'return')
        extraCleanups.push(() => clearTimeout(result.value))
    }
    await platformWait(30)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
    expect(service.getState().context.value).toBe('b')
  })

  it('preserves an unrelated actual timer sharing the same delay bucket', async () => {
    const fired = vi.fn()
    const foreign = platformSetTimeout(fired, 10)
    extraCleanups.push(() => clearTimeout(foreign))
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    const schedule = vi.spyOn(globalThis, 'setTimeout')
    const { service } = start({ openDelay: 10 })
    const dispatch = vi.spyOn(service, 'send')
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    const own = schedule.mock.results[0].value
    extraCleanups.push(() => clearTimeout(own))
    service.stop()
    expect(clear).toHaveBeenCalledTimes(1)
    expect(clear.mock.calls.some(([value]) => value === foreign)).toBe(false)
    await platformWait(30)
    expect(fired).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
  it.each([false, true])('does not resurrect a timer transition after notification stops its run (restart=%s)', async (restart) => {
    let service: ReturnType<typeof machine>
    const onValueChange = vi.fn(() => {
      service.stop()
      if (restart)
        service.start()
    })
    service = machine({ id: 'reentrant-notification', openDelay: 10, onValueChange }).start()
    services.push(service)
    service.send({ type: 'TRIGGER_ENTER', value: 'a' })
    await platformWait(30)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: 'a' })
    expect(service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(service.state.matches('open')).toBe(false)
    expect(service.state.context.openTimer).toBe(null)
    service.stop()
  })
})
