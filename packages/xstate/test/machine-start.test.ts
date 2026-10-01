import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMachine, MachineStatus } from '../index'

describe('machine start', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it.each([false, true])('preserves a running snapshot without notifying listeners (sync: %s)', async (sync) => {
    const listener = vi.fn()
    const machine = createMachine({
      context: { count: 0 },
      initial: 'idle',
      states: {
        idle: {
          tags: ['idle'],
          on: { NEXT: { target: 'active' } },
        },
        active: {
          tags: ['active'],
          on: {
            INCREMENT: {
              actions(ctx) {
                ctx.count++
              },
            },
          },
        },
      },
    }, { sync })

    machine.start().send('NEXT')
    await Promise.resolve()
    machine.subscribe(listener)
    listener.mockClear()
    const before = machine.getState()
    const initialState = machine.initialState

    expect(machine.start()).toBe(machine)
    expect(machine.start({ value: 'idle', context: { count: 99 } })).toBe(machine)
    await Promise.resolve()

    expect(machine.status).toBe(MachineStatus.Running)
    expect(machine.getState()).toBe(before)
    expect(machine.initialState).toBe(initialState)
    expect(machine.state.value).toBe('active')
    expect(machine.state.hasTag('active')).toBe(true)
    expect(listener).not.toHaveBeenCalled()

    machine.send('INCREMENT')
    expect(machine.state.context.count).toBe(1)
    machine.stop()
  })

  it('keeps entry effects and activity cleanup paired across repeated starts and restarts', () => {
    const rootEntry = vi.fn()
    const stateEntry = vi.fn()
    const stateExit = vi.fn()
    const rootCleanup = vi.fn()
    const stateCleanup = vi.fn()
    const rootActivity = vi.fn(() => rootCleanup)
    const stateActivity = vi.fn(() => stateCleanup)
    const machine = createMachine({
      entry: rootEntry,
      activities: [rootActivity],
      initial: 'idle',
      states: {
        idle: {
          tags: ['ready'],
          entry: stateEntry,
          exit: stateExit,
          activities: [stateActivity],
        },
      },
    })

    machine.start().start().start()
    expect(rootEntry).toHaveBeenCalledTimes(1)
    expect(stateEntry).toHaveBeenCalledTimes(1)
    expect(rootActivity).toHaveBeenCalledTimes(1)
    expect(stateActivity).toHaveBeenCalledTimes(1)
    expect(rootCleanup).not.toHaveBeenCalled()
    expect(stateCleanup).not.toHaveBeenCalled()

    machine.stop()
    machine.stop()
    expect(stateExit).toHaveBeenCalledTimes(1)
    expect(rootCleanup).toHaveBeenCalledTimes(1)
    expect(stateCleanup).toHaveBeenCalledTimes(1)

    machine.start().start()
    expect(machine.state.value).toBe('idle')
    expect(machine.state.hasTag('ready')).toBe(true)
    expect(rootEntry).toHaveBeenCalledTimes(2)
    expect(stateEntry).toHaveBeenCalledTimes(2)
    expect(rootActivity).toHaveBeenCalledTimes(2)
    expect(stateActivity).toHaveBeenCalledTimes(2)

    machine.stop()
    expect(stateExit).toHaveBeenCalledTimes(2)
    expect(rootCleanup).toHaveBeenCalledTimes(2)
    expect(stateCleanup).toHaveBeenCalledTimes(2)
  })

  it('preserves active timers and clears them when the original state exits', () => {
    const tick = vi.fn()
    const exit = vi.fn()
    const machine = createMachine({
      initial: 'waiting',
      states: {
        waiting: {
          every: { 10: tick },
          after: { 30: { target: 'ready' } },
          exit,
        },
        ready: {},
      },
    })

    machine.start()
    vi.advanceTimersByTime(10)
    machine.start()
    vi.advanceTimersByTime(20)

    expect(machine.state.value).toBe('ready')
    expect(exit).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(3)
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(100)
    expect(tick).toHaveBeenCalledTimes(3)

    machine.stop()
    machine.start()
    expect(vi.getTimerCount()).toBe(2)
    machine.stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('keeps one context watcher per run and removes it on stop', async () => {
    const watch = vi.fn()
    const machine = createMachine({
      context: { count: 0 },
      watch: { count: watch },
      initial: 'idle',
      states: { idle: {} },
    })

    machine.start().start()
    machine.setContext({ count: 1 })
    await Promise.resolve()
    expect(watch).toHaveBeenCalledTimes(1)

    machine.stop()
    machine.setContext({ count: 2 })
    await Promise.resolve()
    expect(watch).toHaveBeenCalledTimes(1)

    machine.start().start()
    machine.setContext({ count: 3 })
    await Promise.resolve()
    expect(watch).toHaveBeenCalledTimes(2)
    machine.stop()
  })
})
