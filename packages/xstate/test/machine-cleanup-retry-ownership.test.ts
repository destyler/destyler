import { createMachine, MachineStatus } from '@destyler/xstate'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

it('retains a failed root disposer across restart with one activity declaration', () => {
  const active = new Set<number>()
  const attempts: number[] = []
  let acquisition = 0
  const failure = new Error('first cleanup attempt failed')
  const machine = createMachine({ initial: 'idle', activities: [function resource() {
    const id = ++acquisition
    active.add(id)
    if (id === 1)
      machine.stop()
    return () => {
      attempts.push(id)
      if (id === 1 && attempts.filter(n => n === 1).length === 1)
        throw failure
      active.delete(id)
    }
  }], states: { idle: {} } })
  expect(() => machine.start()).toThrow(failure)
  expect(machine.status).toBe(MachineStatus.Stopped)
  machine.start()
  machine.stop()
  machine.stop()
  expect([...active]).toEqual([])
  expect(attempts).toEqual([1, 1, 2])
})

it('retains a failed final disposer across restart with one activity declaration', () => {
  const active = new Set<number>()
  const attempts: number[] = []
  let acquisition = 0
  const failure = new Error('first final cleanup attempt failed')
  const machine = createMachine({ initial: 'idle', states: { idle: { on: { FINISH: 'done' } }, done: { type: 'final', activities: [function resource() {
    const id = ++acquisition
    active.add(id)
    if (id === 1)
      machine.stop()
    return () => {
      attempts.push(id)
      if (id === 1 && attempts.filter(n => n === 1).length === 1)
        throw failure
      active.delete(id)
    }
  }] } } }).start()
  expect(() => machine.send('FINISH')).toThrow(failure)
  expect(machine.status).toBe(MachineStatus.Stopped)
  machine.start()
  machine.send('FINISH')
  machine.stop()
  expect([...active]).toEqual([])
  expect(attempts).toEqual([1, 1, 2])
})

it('retains current-run and retired late-throwing root cleanup when restart occurs inside acquisition', () => {
  const active = new Set<number>()
  const attempts: number[] = []
  let acquisition = 0
  const failure = new Error('retired cleanup failed')
  const machine = createMachine({ initial: 'idle', activities: [function resource() {
    const id = ++acquisition
    active.add(id)
    if (id === 1) {
      machine.stop()
      machine.start()
    }
    return () => {
      attempts.push(id)
      if (id === 1 && attempts.filter(n => n === 1).length === 1)
        throw failure
      active.delete(id)
    }
  }], states: { idle: {} } })
  expect(() => machine.start()).toThrow(failure)
  expect(machine.status).toBe(MachineStatus.Running)
  machine.stop()
  expect([...active]).toEqual([])
  expect(attempts).toEqual([1, 2, 1])
})

it('allows explicit failed disposer retry before starting the next run', () => {
  const active = new Set<number>()
  let acquisition = 0
  let attempts = 0
  const failure = new Error('cleanup failed')
  const machine = createMachine({ initial: 'idle', activities: [function resource() {
    const id = ++acquisition
    active.add(id)
    if (id === 1)
      machine.stop()
    return () => {
      if (++attempts === 1)
        throw failure
      active.delete(id)
    }
  }], states: { idle: {} } })
  expect(() => machine.start()).toThrow(failure)
  machine.stop()
  machine.start()
  machine.stop()
  expect([...active]).toEqual([])
})
