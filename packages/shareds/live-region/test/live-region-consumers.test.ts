// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine as calendarMachine } from '../../../components/calendar/src/machine'
import { parse } from '../../../components/calendar/src/parse'
import { machine as dynamicMachine } from '../../../components/dynamic/src/machine'

const services: Array<{ stop: () => void }> = []
beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function start(kind: 'calendar' | 'dynamic', id: string) {
  if (kind === 'calendar') {
    const service = calendarMachine({ id })
    services.push(service)
    service.start()
    return {
      stop: () => service.stop(),
      announce: () => service.send({ type: 'VALUE.SET', value: [parse('2026-10-02')] }),
    }
  }
  const service = dynamicMachine({ id })
  services.push(service)
  service.start()
  return {
    stop: () => service.stop(),
    announce: () => service.send({ type: 'ADD_TAG', value: 'Consumer tag' }),
  }
}

describe('real Calendar and Dynamic live-region lifecycle', () => {
  it.each([
    ['calendar', 'calendar'],
    ['dynamic', 'dynamic'],
    ['calendar', 'dynamic'],
    ['dynamic', 'calendar'],
  ] as const)('stopping unused %s preserves the active %s announcement', async (idleKind, activeKind) => {
    const idle = start(idleKind, 'unused-consumer')
    const active = start(activeKind, 'active-consumer')
    active.announce()
    await vi.advanceTimersByTimeAsync(0)
    const region = document.querySelector('[data-live-announcer]')!
    expect(region).not.toBeNull()
    expect(region.getAttribute('role')).toBe('alert')
    idle.stop()
    expect(region.isConnected).toBe(true)
    await vi.advanceTimersByTimeAsync(3000)
    expect(region.textContent).not.toBe('')
    active.stop()
    expect(region.isConnected).toBe(false)
  })

  it.each(['calendar', 'dynamic'] as const)('stopping the active %s cancels its pending announcement write', async (kind) => {
    const active = start(kind, 'active-consumer')
    active.announce()
    // Watchers use microtasks; do not fire the live-region timeout yet.
    await Promise.resolve()
    await Promise.resolve()
    const region = document.querySelector('[data-live-announcer]')!
    expect(region).not.toBeNull()
    expect(region.textContent).toBe('')
    active.stop()
    await vi.advanceTimersByTimeAsync(3000)
    expect(region.isConnected).toBe(false)
    expect(region.textContent).toBe('')
  })

  it('retired Calendar cleanup preserves a newer Dynamic announcement', async () => {
    const calendar = start('calendar', 'calendar-consumer')
    const dynamic = start('dynamic', 'dynamic-consumer')
    calendar.announce()
    await vi.advanceTimersByTimeAsync(0)
    const old = document.querySelector('[data-live-announcer]')!
    dynamic.announce()
    await vi.advanceTimersByTimeAsync(0)
    const current = document.querySelector('[data-live-announcer]')!
    expect(current).not.toBe(old)
    expect(old.isConnected).toBe(false)
    calendar.stop()
    expect(current.isConnected).toBe(true)
    expect(current.textContent).toBe('Added tag Consumer tag')
    dynamic.stop()
    expect(current.isConnected).toBe(false)
  })
})
