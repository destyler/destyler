import type { UserDefinedContext } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'
import { store } from '../src/store'

const services: ReturnType<typeof machine>[] = []
let sequence = 0

function start(options: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: `tooltip-lifecycle-${sequence++}`, openDelay: 50, closeDelay: 50, ...options })
  services.push(service)
  service.start()
  return service
}

beforeEach(() => {
  vi.useFakeTimers()
  store.setId(null)
})

afterEach(() => {
  services.reverse().forEach(service => service.stop())
  services.length = 0
  store.setId(null)
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('tooltip visible-owner lifecycle', () => {
  it('honors the ordinary delay when no tooltip is visible', async () => {
    const onOpenChange = vi.fn()
    const service = start({ onOpenChange })
    service.send('POINTER_MOVE')
    expect(service.state.value).toBe('opening')
    await vi.advanceTimersByTimeAsync(49)
    expect(service.state.hasTag('open')).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(service.state.hasTag('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
  })

  it.each([false, true])('releases the visible owner on stop (controlled: %s)', async (controlled) => {
    const onOpenChange = vi.fn()
    const visible = start({ onOpenChange, ...(controlled ? { open: true } : { defaultOpen: true }) })
    expect(store.id).toBe(visible.state.context.id)
    visible.stop()
    expect(onOpenChange).not.toHaveBeenCalled()
    const next = start()
    next.send('POINTER_MOVE')
    expect(next.state.value).toBe('opening')
    expect(store.id).toBeNull()
    await vi.advanceTimersByTimeAsync(49)
    expect(next.state.hasTag('open')).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(next.state.hasTag('open')).toBe(true)
  })

  it('releases the owner if stopped during its closing delay', async () => {
    const visible = start({ defaultOpen: true })
    visible.send('POINTER_LEAVE')
    expect(visible.state.value).toBe('closing')
    visible.stop()
    const next = start()
    next.send('POINTER_MOVE')
    expect(next.state.value).toBe('opening')
    await vi.advanceTimersByTimeAsync(50)
    expect(next.state.hasTag('open')).toBe(true)
  })

  it('preserves the current visible owner when an older service stops', () => {
    const older = start({ defaultOpen: true })
    const visible = start({ defaultOpen: true })
    older.stop()
    expect(store.id).toBe(visible.state.context.id)
    const next = start()
    next.send('POINTER_MOVE')
    expect(next.state.value).toBe('open')
  })

  it('preserves another owner when an unopened service stops repeatedly', () => {
    const inactive = start()
    const visible = start({ defaultOpen: true })
    inactive.stop()
    inactive.stop()
    expect(store.id).toBe(visible.state.context.id)
  })

  it('keeps ordinary close behavior and does not close a newer owner on repeated stop', () => {
    const older = start({ defaultOpen: true })
    older.send('CLOSE')
    expect(store.id).toBeNull()
    older.stop()
    const visible = start({ defaultOpen: true })
    older.stop()
    expect(store.id).toBe(visible.state.context.id)
  })

  it('cancels a pending opening delay on stop and supports restart', async () => {
    const onOpenChange = vi.fn()
    const service = start({ onOpenChange })
    service.send('POINTER_MOVE')
    await vi.advanceTimersByTimeAsync(25)
    service.stop()
    await vi.advanceTimersByTimeAsync(100)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(store.id).toBeNull()
    service.start()
    service.send('POINTER_MOVE')
    await vi.advanceTimersByTimeAsync(49)
    expect(service.state.hasTag('open')).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(service.state.hasTag('open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
  })
})
