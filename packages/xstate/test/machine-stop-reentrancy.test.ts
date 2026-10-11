import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { choose, createMachine, MachineStatus } from '../index'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

it('preserves existing restart timing: start during teardown is ignored, start after teardown works', () => {
  const entry = vi.fn()
  const observed: MachineStatus[] = []
  const machine = createMachine({ initial: 'idle', entry, exit: () => {
    observed.push(machine.status)
    machine.start()
  }, states: { idle: {} } })
  machine.start().stop()
  expect(observed).toEqual([MachineStatus.Running])
  expect(entry).toHaveBeenCalledTimes(1)
  expect(machine.status).toBe(MachineStatus.Stopped)
  machine.start()
  expect(entry).toHaveBeenCalledTimes(2)
  expect(machine.status).toBe(MachineStatus.Running)
})

it('does not resume old transition after a complete stop and new start inside an action', () => {
  const staleEntry = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { on: { GO: { target: 'stale', actions: (_ctx, _evt, { self }) => {
      self.stop()
      machine.start({ value: 'fresh' })
    } } } },
    stale: { entry: staleEntry },
    fresh: {},
  } }).start()
  machine.send('GO')
  expect(machine.status).toBe(MachineStatus.Running)
  expect(machine.state.value).toBe('fresh')
  expect(staleEntry).not.toHaveBeenCalled()
})

it.each(['root', 'state'] as const)('disposes cleanup returned after a %s activity stops the machine', (location) => {
  const cleanup = vi.fn()
  const nextActivity = vi.fn()
  const activities = [
    (_ctx: unknown, _evt: unknown, { self }: { self: { stop: () => void } }) => {
      self.stop()
      return cleanup
    },
    nextActivity,
  ]
  const machine = createMachine({
    initial: 'idle',
    activities: location === 'root' ? activities : undefined,
    states: { idle: { activities: location === 'state' ? activities : undefined } },
  }).start()

  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(nextActivity).not.toHaveBeenCalled()
})

it('does not run later actions after stop', () => {
  const later = vi.fn()
  const machine = createMachine({ initial: 'idle', states: { idle: { on: { GO: { actions: [(_ctx, _evt, { self }) => self.stop(), later] } } } } }).start()
  machine.send('GO')
  expect(later).not.toHaveBeenCalled()
})

it('ignores events emitted by teardown callbacks', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  const action = vi.fn()
  const machine = createMachine({ initial: 'idle', exit: (_ctx, _evt, { send }) => send('UPDATE'), on: { UPDATE: { actions: action } }, states: { idle: {} } }).start()
  machine.stop()
  expect(action).not.toHaveBeenCalled()
})

it('does not resume initial entry after a synchronous listener stops on init', () => {
  const entry = vi.fn()
  const machine = createMachine({ initial: 'idle', states: { idle: { entry, tags: ['idle'] } } }, { sync: true })
  machine.subscribe((state) => {
    if (state.event.type === 'machine.init')
      machine.stop()
  })
  machine.start()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(machine.state.value).toBe('')
  expect(machine.state.tags).toEqual([])
  expect(entry).not.toHaveBeenCalled()
})

it.each(['root', 'state'] as const)('does not enter or schedule work after stop in %s entry', (location) => {
  const later = vi.fn()
  const tick = vi.fn()
  const stop = (_ctx: unknown, _evt: unknown, { self }: { self: { stop: () => void } }) => self.stop()
  const machine = createMachine({
    initial: 'idle',
    entry: location === 'root' ? [stop, later] : undefined,
    states: { idle: { entry: location === 'state' ? [stop, later] : later, every: { 10: tick }, after: { 20: 'active' } }, active: {} },
  }).start()

  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(machine.state.value).toBe('')
  expect(later).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
  vi.advanceTimersByTime(100)
  expect(tick).not.toHaveBeenCalled()
})

it('does not start target effects when a transition action stops', () => {
  const entry = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { on: { GO: { target: 'active', actions: (_ctx, _evt, { self }) => self.stop() } } },
    active: { entry, every: { 10: vi.fn<() => void>() } },
  } }).start()

  machine.send('GO')
  expect(machine.state.value).toBe('')
  expect(entry).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
})

it.each(['activity', 'root exit', 'state exit'] as const)('makes reentrant stop idempotent from %s', (location) => {
  const callback = vi.fn((_ctx, _evt, { self }) => self.stop())
  const machine = createMachine({
    initial: 'idle',
    exit: location === 'root exit' ? callback : undefined,
    states: { idle: {
      exit: location === 'state exit' ? callback : undefined,
      activities: location === 'activity' ? [(_ctx, _evt, meta) => () => callback(_ctx, _evt, meta)] : undefined,
    } },
  }).start()

  machine.stop()
  expect(callback).toHaveBeenCalledTimes(1)
  expect(machine.status).toBe(MachineStatus.Stopped)
  machine.stop()
  expect(callback).toHaveBeenCalledTimes(1)
})

it('does not repeat an in-flight state exit when that exit stops', () => {
  const exit = vi.fn((_ctx, _evt, { self }) => self.stop())
  const entry = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { exit, on: { GO: 'active' } },
    active: { entry },
  } }).start()

  machine.send('GO')
  expect(exit).toHaveBeenCalledTimes(1)
  expect(entry).not.toHaveBeenCalled()
  expect(machine.state.value).toBe('')
})

it('detaches an activity before invoking its reentrant stopActivity cleanup', () => {
  const cleanup = vi.fn()
  const machine = createMachine({ initial: 'idle', states: { idle: {
    activities: ['listen'],
    on: { CANCEL: { actions: (_ctx, _evt, { self }) => self.stopActivity('listen') } },
  } } }, { activities: { listen: (_ctx, _evt, { self }) => () => {
    cleanup()
    self.stopActivity('listen')
  } } }).start()

  machine.send('CANCEL')
  expect(cleanup).toHaveBeenCalledTimes(1)
  machine.stop()
  expect(cleanup).toHaveBeenCalledTimes(1)
})

it('stops the old watcher batch after stop and restart', async () => {
  const later = vi.fn()
  const machine = createMachine({
    context: { first: 0, second: 0 },
    initial: 'idle',
    states: { idle: {} },
    watch: { first: (_ctx, _evt, { self }) => {
      self.stop()
      machine.start()
    }, second: later },
  }).start()

  machine.setContext({ first: 1, second: 1 })
  await Promise.resolve()
  expect(later).not.toHaveBeenCalled()
  machine.setContext({ second: 2 })
  await Promise.resolve()
  expect(later).toHaveBeenCalledTimes(1)
  machine.stop()
})

it('does not overwrite cleared tags after a synchronous subscriber stops on target state', () => {
  const machine = createMachine({ initial: 'idle', states: {
    idle: { on: { GO: 'active' } },
    active: { tags: ['active'] },
  } }, { sync: true }).start()
  machine.subscribe((state) => {
    if (state.value === 'active')
      machine.stop()
  })

  machine.send('GO')
  expect(machine.state.value).toBe('')
  expect(machine.state.tags).toEqual([])
  expect(machine.status).toBe(MachineStatus.Stopped)
})

it('preserves synchronous sends and the remaining actions while the run stays active', () => {
  const order: string[] = []
  const machine = createMachine({ initial: 'idle', states: { idle: { on: {
    OUTER: { actions: [(_ctx, _evt, { send }) => {
      order.push('outer')
      send('INNER')
    }, () => order.push('after inner')] },
    INNER: { actions: () => order.push('inner') },
  } } } }).start()

  machine.send('OUTER')
  expect(order).toEqual(['outer', 'inner', 'after inner'])
  expect(machine.status).toBe(MachineStatus.Running)
  machine.stop()
})

it('preserves synchronous sends from entry and listener callbacks without stopping', () => {
  const action = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { entry: (_ctx, _evt, { send }) => send('GO'), on: { GO: 'active' } },
    active: { on: { UPDATE: { actions: action } } },
  } }, { sync: true })
  let sent = false
  machine.subscribe((state) => {
    if (state.value === 'active' && !sent) {
      sent = true
      machine.send('UPDATE')
    }
  })

  machine.start()
  expect(machine.state.value).toBe('active')
  expect(action).toHaveBeenCalledTimes(1)
  machine.stop()
})

it('does not stop a new run started by a final-state listener', () => {
  const later = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { on: { FINISH: 'done' } },
    done: { type: 'final' },
  } })
  machine.onDone(() => {
    machine.stop()
    machine.start()
  }).onDone(later).start()

  machine.send('FINISH')
  expect(machine.status).toBe(MachineStatus.Running)
  expect(machine.state.value).toBe('idle')
  expect(later).not.toHaveBeenCalled()
  machine.stop()
})

it('does not enter a state after hydration context triggers a synchronous stop', () => {
  const entry = vi.fn()
  const machine = createMachine({ context: { count: 0 }, initial: 'idle', states: { idle: { entry } } }, { sync: true })
  machine.subscribe((state) => {
    if (state.context.count === 1)
      machine.stop()
  })

  machine.start({ value: 'idle', context: { count: 1 } })
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(machine.state.value).toBe('')
  expect(entry).not.toHaveBeenCalled()
})

it.each(['after object', 'after array', 'every object', 'every array'] as const)('does not schedule %s work after a delay resolver stops', (kind) => {
  const action = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    states: {
      idle: {
        after: kind === 'after object' ? { PAUSE: 'active' } : kind === 'after array' ? [{ delay: 'PAUSE', target: 'active' }] : undefined,
        every: kind === 'every object' ? { PAUSE: action } : kind === 'every array' ? [{ delay: 'PAUSE', actions: action }] : undefined,
        entry: action,
      },
      active: { entry: action },
    },
  }, { delays: { PAUSE: () => {
    machine.stop()
    return 10
  } } })

  machine.start()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(action).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
})

it('does not execute conditional actions after their selection guard stops', () => {
  const action = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    entry: choose([{ guard: () => {
      machine.stop()
      return true
    }, actions: action }]),
    states: { idle: {} },
  })

  machine.start()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(action).not.toHaveBeenCalled()
})

it.each(['after', 'every'] as const)('does not start effects after an %s guard stops', (kind) => {
  const action = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    states: {
      idle: {
        after: kind === 'after'
          ? [{ delay: 10, target: 'active', guard: () => {
              machine.stop()
              return true
            } }]
          : undefined,
        every: kind === 'every'
          ? [{ delay: 10, actions: action, guard: () => {
              machine.stop()
              return true
            } }]
          : undefined,
        entry: action,
      },
      active: { entry: action },
    },
  })

  machine.start()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(action).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
})

it('does not run a watcher after its comparator stops', async () => {
  const watch = vi.fn()
  const machine = createMachine({ context: { count: 0 }, initial: 'idle', states: { idle: {} }, watch: { count: watch } }, {
    compareFns: { count: () => {
      machine.stop()
      return false
    } },
  }).start()

  machine.setContext({ count: 1 })
  await Promise.resolve()
  expect(watch).not.toHaveBeenCalled()
  expect(machine.status).toBe(MachineStatus.Stopped)
})

it('does not notify new-run subscribers from an old synchronous notification', () => {
  const newListener = vi.fn()
  const machine = createMachine({ context: { count: 0 }, initial: 'idle', states: { idle: {} } }, { sync: true }).start()
  let handled = false
  machine.subscribe((state) => {
    if (state.context.count === 1 && !handled) {
      handled = true
      machine.stop()
      machine.start()
      machine.subscribe(newListener)
    }
  })

  machine.setContext({ count: 1 })
  expect(newListener).toHaveBeenCalledTimes(1)
  expect(machine.status).toBe(MachineStatus.Running)
  machine.stop()
})

it('still executes state and root exits once when an activity cleanup initiates stop', () => {
  const cleanup = vi.fn()
  const stateExit = vi.fn()
  const rootExit = vi.fn()
  const targetEntry = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    exit: rootExit,
    states: {
      idle: {
        activities: [(_ctx, _evt, { self }) => () => {
          cleanup()
          self.stop()
        }],
        exit: stateExit,
        on: { GO: 'active' },
      },
      active: { entry: targetEntry },
    },
  }).start()

  machine.send('GO')
  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(stateExit).toHaveBeenCalledTimes(1)
  expect(rootExit).toHaveBeenCalledTimes(1)
  expect(targetEntry).not.toHaveBeenCalled()
  expect(machine.status).toBe(MachineStatus.Stopped)
})

it('does not execute exit actions selected by a guard that stops', () => {
  const selectedExit = vi.fn()
  const targetEntry = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    states: {
      idle: {
        exit: choose([{ guard: () => {
          machine.stop()
          return true
        }, actions: selectedExit }]),
        on: { GO: 'active' },
      },
      active: { entry: targetEntry },
    },
  }).start()

  machine.send('GO')
  expect(selectedExit).not.toHaveBeenCalled()
  expect(targetEntry).not.toHaveBeenCalled()
  expect(machine.status).toBe(MachineStatus.Stopped)
})

it('does not execute a delayed transition after its firing-time guard stops', () => {
  const action = vi.fn()
  const targetEntry = vi.fn()
  const machine = createMachine({
    initial: 'idle',
    states: {
      idle: { after: { 10: { target: 'active', actions: action, guard: () => {
        machine.stop()
        return true
      } } } },
      active: { entry: targetEntry, every: { 20: action } },
    },
  }).start()

  vi.advanceTimersByTime(10)
  expect(action).not.toHaveBeenCalled()
  expect(targetEntry).not.toHaveBeenCalled()
  expect(machine.state.value).toBe('')
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(vi.getTimerCount()).toBe(0)
})
