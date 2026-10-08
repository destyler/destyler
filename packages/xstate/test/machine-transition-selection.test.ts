import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { choose, createMachine } from '../index'

describe('transition selection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it.each(['event', 'after', 'reenter'] as const)('retains the selected actions after exit changes context (%s)', (source) => {
    const order: string[] = []
    const guard = vi.fn((ctx: { allowed: boolean }) => ctx.allowed)
    const transition = {
      target: source === 'reenter' ? 'idle' : 'active',
      guard,
      actions: (ctx: { allowed: boolean }) => {
        expect(ctx.allowed).toBe(false)
        order.push('transition')
      },
    }
    const machine = createMachine<{ allowed: boolean }>({
      context: { allowed: true },
      initial: 'idle',
      states: {
        idle: {
          entry: () => order.push('enter idle'),
          exit: (ctx) => {
            order.push('exit idle')
            ctx.allowed = false
          },
          on: { GO: transition },
          after: source === 'after' ? { 10: transition } : undefined,
        },
        active: { entry: () => order.push('enter active') },
      },
    }).start()
    order.length = 0

    if (source === 'after')
      vi.advanceTimersByTime(10)
    else
      machine.send('GO')

    expect(machine.state.value).toBe(transition.target)
    expect(order).toEqual(['exit idle', 'transition', `enter ${transition.target}`])
    expect(guard).toHaveBeenCalledTimes(1)
    machine.stop()
  })

  it('evaluates candidates once in order and executes only the selected actions', () => {
    const rejectedGuard = vi.fn(() => false)
    const acceptedGuard = vi.fn(() => true)
    const unusedGuard = vi.fn(() => true)
    const rejected = vi.fn()
    const accepted = vi.fn()
    const unused = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      on: {
        GO: [
          { target: 'rejected', guard: rejectedGuard, actions: rejected },
          { target: 'accepted', guard: acceptedGuard, actions: accepted },
          { target: 'unused', guard: unusedGuard, actions: unused },
        ],
      },
      states: { idle: {}, rejected: {}, accepted: {}, unused: {} },
    }).start()

    machine.send('GO')
    expect(machine.state.value).toBe('accepted')
    expect(rejectedGuard).toHaveBeenCalledTimes(1)
    expect(acceptedGuard).toHaveBeenCalledTimes(1)
    expect(unusedGuard).not.toHaveBeenCalled()
    expect(rejected).not.toHaveBeenCalled()
    expect(accepted).toHaveBeenCalledTimes(1)
    expect(unused).not.toHaveBeenCalled()
    machine.stop()
  })

  it('evaluates a targetless transition guard once without entry or exit effects', () => {
    const guard = vi.fn(() => true)
    const action = vi.fn()
    const entry = vi.fn()
    const exit = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      states: { idle: { entry, exit, on: { UPDATE: { guard, actions: action } } } },
    }).start()
    entry.mockClear()

    machine.send('UPDATE')
    expect(guard).toHaveBeenCalledTimes(1)
    expect(action).toHaveBeenCalledTimes(1)
    expect(entry).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
    machine.stop()
  })

  it('does not run rejected transition effects', () => {
    const guard = vi.fn(() => false)
    const action = vi.fn()
    const exit = vi.fn()
    const entry = vi.fn()
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { exit, on: { GO: { target: 'active', guard, actions: action } } },
        active: { entry },
      },
    }).start()

    machine.send('GO')
    expect(machine.state.value).toBe('idle')
    expect(guard).toHaveBeenCalledTimes(1)
    expect(action).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
    expect(entry).not.toHaveBeenCalled()
    machine.stop()
  })

  it('still resolves conditional actions after exit effects', () => {
    const beforeExit = vi.fn()
    const afterExit = vi.fn()
    const machine = createMachine({
      context: { exited: false },
      initial: 'idle',
      states: {
        idle: {
          exit: (ctx) => { ctx.exited = true },
          on: {
            GO: {
              target: 'active',
              actions: choose([
                { guard: ctx => ctx.exited, actions: afterExit },
                { actions: beforeExit },
              ]),
            },
          },
        },
        active: {},
      },
    }).start()

    machine.send('GO')
    expect(afterExit).toHaveBeenCalledTimes(1)
    expect(beforeExit).not.toHaveBeenCalled()
    machine.stop()
  })
})
