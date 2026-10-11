import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMachine } from '../index'

describe('machine activity cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it.each(['exit', 'stop', 'reenter'] as const)('cleans up every interval on %s', (operation) => {
    const fast = vi.fn()
    const slow = vi.fn()
    const machine = createMachine({
      initial: 'active',
      states: {
        active: {
          every: { 10: fast, 25: slow },
          on: { LEAVE: 'idle', REENTER: 'active' },
        },
        idle: {},
      },
    }).start()

    vi.advanceTimersByTime(50)
    expect(fast).toHaveBeenCalledTimes(5)
    expect(slow).toHaveBeenCalledTimes(2)

    if (operation === 'stop')
      machine.stop()
    else
      machine.send(operation === 'exit' ? 'LEAVE' : 'REENTER')

    expect(vi.getTimerCount()).toBe(operation === 'reenter' ? 2 : 0)
    fast.mockClear()
    slow.mockClear()
    vi.advanceTimersByTime(50)
    expect(fast).toHaveBeenCalledTimes(operation === 'reenter' ? 5 : 0)
    expect(slow).toHaveBeenCalledTimes(operation === 'reenter' ? 2 : 0)
    machine.stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cleans up distinct inline activities with the same function name', () => {
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const makeActivity = (cleanup: () => void) => function listen() {
      return cleanup
    }
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { activities: [makeActivity(firstCleanup), makeActivity(secondCleanup)] },
      },
    }).start()

    machine.stop()
    expect(firstCleanup).toHaveBeenCalledTimes(1)
    expect(secondCleanup).toHaveBeenCalledTimes(1)
    machine.stop()
    expect(firstCleanup).toHaveBeenCalledTimes(1)
    expect(secondCleanup).toHaveBeenCalledTimes(1)
  })

  it('stops all executions of a named activity without cleaning them up again on exit', () => {
    const cleanup = vi.fn()
    const activity = vi.fn(() => cleanup)
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          activities: ['listen', 'listen'],
          on: { CANCEL: { actions: (_ctx, _event, { self }) => self.stopActivity('listen') } },
        },
      },
    }, { activities: { listen: activity } }).start()

    expect(activity).toHaveBeenCalledTimes(2)
    machine.send('CANCEL')
    expect(cleanup).toHaveBeenCalledTimes(2)
    machine.stop()
    expect(cleanup).toHaveBeenCalledTimes(2)

    machine.start().stop()
    expect(activity).toHaveBeenCalledTimes(4)
    expect(cleanup).toHaveBeenCalledTimes(4)
  })

  it('cleans up every root activity across restart cycles', () => {
    const cleanup = vi.fn()
    const machine = createMachine({
      activities: ['listen', 'listen'],
      initial: 'idle',
      states: { idle: {} },
    }, { activities: { listen: () => cleanup } })

    machine.start().stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
    machine.start().stop()
    expect(cleanup).toHaveBeenCalledTimes(4)
  })
})
