import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMachine, MachineStatus } from '../index'

describe('stopped machine events', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it.each([false, true])('ignores root actions and transitions after stop (direct transition: %s)', (direct) => {
    const action = vi.fn((ctx: { count: number }) => {
      ctx.count++
    })
    const guard = vi.fn(() => true)
    const entry = vi.fn()
    const machine = createMachine<{ count: number }>({
      context: { count: 0 },
      initial: 'idle',
      on: {
        INCREMENT: { actions: action, guard },
        ACTIVATE: { target: 'active', actions: action, guard },
      },
      states: {
        idle: {},
        active: { entry, tags: ['active'] },
      },
    })

    machine.start().stop()
    const before = machine.getState()

    if (direct) {
      machine.transition('idle', 'INCREMENT')
      machine.transition(machine.initialState!, { type: 'ACTIVATE' })
    }
    else {
      machine.send('INCREMENT')
      machine.send({ type: 'ACTIVATE' })
    }

    expect(machine.status).toBe(MachineStatus.Stopped)
    expect(machine.getState()).toBe(before)
    expect(action).not.toHaveBeenCalled()
    expect(guard).not.toHaveBeenCalled()
    expect(entry).not.toHaveBeenCalled()

    machine.start().send('ACTIVATE')
    expect(machine.status).toBe(MachineStatus.Running)
    expect(machine.state.value).toBe('active')
    expect(machine.state.hasTag('active')).toBe(true)
    expect(machine.state.context.count).toBe(1)
    expect(action).toHaveBeenCalledTimes(1)
    expect(entry).toHaveBeenCalledTimes(1)
    machine.stop()
  })

  it.each([false, true])('ignores state events after stop (direct transition: %s)', (direct) => {
    const action = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { UPDATE: { actions: action } } },
      },
    })

    machine.start().stop()
    const before = machine.getState()
    if (direct) {
      expect(machine.transition('idle', 'UPDATE')).toBeUndefined()
    }
    else {
      machine.send('UPDATE')
    }
    expect(action).not.toHaveBeenCalled()
    expect(machine.getState()).toBe(before)
    expect(console.warn).toHaveBeenCalledWith('[@destyler/xstate > transition] Cannot transition a stopped machine')
  })

  it('ignores queued activity events without recreating stopped effects', async () => {
    const cleanup = vi.fn()
    const stateCleanup = vi.fn()
    const activity = vi.fn(() => stateCleanup)
    const tick = vi.fn()
    const entry = vi.fn()
    let sendLateEvent = () => {}
    const machine = createMachine({
      initial: 'idle',
      activities: [(_ctx, _event, { send }) => {
        sendLateEvent = () => send('LATE')
        return cleanup
      }],
      on: { LATE: { target: 'active' } },
      states: {
        idle: {},
        active: {
          entry,
          activities: [activity],
          every: { 10: tick },
          after: { 50: { target: 'idle' } },
        },
      },
    })

    machine.start().send('LATE')
    expect(vi.getTimerCount()).toBe(2)
    const pendingEvent = Promise.resolve().then(sendLateEvent)
    machine.stop()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(stateCleanup).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    const before = machine.getState()

    await pendingEvent
    expect(machine.getState()).toBe(before)
    expect(entry).toHaveBeenCalledTimes(1)
    expect(activity).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
    vi.advanceTimersByTime(100)
    expect(tick).not.toHaveBeenCalled()

    machine.start().send('LATE')
    expect(entry).toHaveBeenCalledTimes(2)
    expect(activity).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(10)
    expect(tick).toHaveBeenCalledTimes(1)
    machine.stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
    expect(stateCleanup).toHaveBeenCalledTimes(2)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ignores root events after automatically stopping at a final state', () => {
    const action = vi.fn()
    const done = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      on: { RESET: { target: 'idle', actions: action } },
      states: {
        idle: { on: { FINISH: { target: 'complete' } } },
        complete: { type: 'final' },
      },
    }).onDone(done)

    machine.start().send('FINISH')
    expect(machine.status).toBe(MachineStatus.Stopped)
    expect(done).toHaveBeenCalledTimes(1)
    const before = machine.getState()

    machine.send('RESET')
    expect(action).not.toHaveBeenCalled()
    expect(machine.getState()).toBe(before)
    expect(done).toHaveBeenCalledTimes(1)
  })
})
