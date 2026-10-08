import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { createMachine, Machine, MachineStatus, subscribe } from '../index'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

it('retains legacy same-run final completion after successful stop', () => {
  const order: string[] = []
  const machine = createMachine({ initial: 'idle', exit: () => order.push('root:exit'), states: {
    idle: { on: { FINISH: { target: 'done', actions: [(_ctx, _evt, { self }) => self.stop(), () => order.push('stale:action')] } } },
    done: { type: 'final', entry: () => order.push('stale:entry') },
  } }).onDone(() => order.push('stale:done')).start()
  machine.send('FINISH')
  expect(order).toEqual(['root:exit', 'stale:action', 'stale:entry', 'stale:done'])
  expect(machine.state.value).toBe('done')
  expect(machine.state.done).toBe(true)
  expect(machine.status).toBe(MachineStatus.Stopped)
})

it('does not complete an ordinary final transition after its action stops and restarts', () => {
  const done = vi.fn()
  const entry = vi.fn()
  const machine = createMachine({ initial: 'idle', states: {
    idle: { on: { FINISH: { target: 'done', actions: () => {
      machine.stop()
      machine.start({ value: 'fresh' })
    } } } },
    fresh: {},
    done: { type: 'final', entry },
  } }).onDone(done).start()
  machine.send('FINISH')
  expect(entry).not.toHaveBeenCalled()
  expect(done).not.toHaveBeenCalled()
  expect(machine.state.value).toBe('fresh')
  expect(machine.state.done).toBe(false)
  expect(machine.status).toBe(MachineStatus.Running)
  machine.stop()
})

it('clears completion on restart without changing retained snapshots or context', () => {
  const done = vi.fn()
  const machine = createMachine({ context: { count: 0 }, initial: 'idle', states: {
    idle: { on: { FINISH: { target: 'done', actions: ctx => ctx.count++ } } },
    done: { type: 'final' },
  } }).onDone(done).start()
  machine.send('FINISH')
  const completed = done.mock.calls[0][0]
  machine.start()
  expect(machine.state.done).toBe(false)
  expect(machine.state.context.count).toBe(1)
  expect(completed.done).toBe(true)
  expect(completed.context.count).toBe(1)
  machine.send('FINISH')
  expect(done).toHaveBeenCalledTimes(2)
})

it('clears completion before root entry on each immediately final run', () => {
  const doneAtEntry: boolean[] = []
  const machine = createMachine({ initial: 'done', entry: (_ctx, _evt, { state }) => doneAtEntry.push(state.done), states: { done: { type: 'final' } } })
  machine.start().start()
  expect(doneAtEntry).toEqual([false, false])
})

it.each(['done', 'value', 'tags'] as const)('does not resume initialization after a direct synchronous state subscriber stops at reset of %s', (key) => {
  const entry = vi.fn()
  const machine = createMachine({ initial: 'idle', entry, states: {
    idle: { on: { FINISH: 'done' } },
    done: { type: 'final', tags: ['complete'] },
  } }).start()
  machine.send('FINISH')
  entry.mockClear()
  let stopped = false
  const release = subscribe(machine.state, () => {
    const matches = key === 'done' ? machine.state.done === false : key === 'value' ? machine.state.value === '' : machine.state.tags.length === 0
    if (!stopped && matches) {
      stopped = true
      machine.stop()
    }
  }, true)
  machine.start()
  release()
  expect(stopped).toBe(true)
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(entry).not.toHaveBeenCalled()
})

it('retains a restarted run initiated by an onDone listener and clears its completion', () => {
  const later = vi.fn()
  const machine = createMachine({ initial: 'idle', states: { idle: { on: { FINISH: 'done' } }, done: { type: 'final' } } })
  machine.onDone(() => {
    machine.stop()
    machine.start()
  }).onDone(later).start()
  machine.send('FINISH')
  expect(machine.state.done).toBe(false)
  expect(machine.state.value).toBe('idle')
  expect(machine.status).toBe(MachineStatus.Running)
  expect(later).not.toHaveBeenCalled()
  machine.stop()
})

it('does not hide errors from a cleanup returned by a self-stopping activity', () => {
  const error = new Error('late cleanup')
  const machine = createMachine({ initial: 'idle', activities: [(_ctx, _evt, { self }) => {
    self.stop()
    return () => {
      throw error
    }
  }], states: { idle: {} } })
  expect(() => machine.start()).toThrow(error)
})

it('uses the originally selected transition but cancels it when exit stops and changes the guard', () => {
  const action = vi.fn()
  const entry = vi.fn()
  const machine = createMachine({ context: { enabled: true }, initial: 'idle', states: {
    idle: {
      exit: (ctx, _evt, { self }) => {
        ctx.enabled = false
        self.stop()
      },
      on: { GO: [{ guard: ctx => ctx.enabled, target: 'next', actions: action }] },
    },
    next: { entry },
  } }).start()
  machine.send('GO')
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(action).not.toHaveBeenCalled()
  expect(entry).not.toHaveBeenCalled()
})

it('keeps subclass fields that use the old candidate private names independent', () => {
  class Derived extends Machine<Record<string, never>, { value: 'idle' }> {
    stopping = 'user'
    lifecycleVersion = 42
    exitingState = 'user'
  }
  const machine = new Derived({ initial: 'idle', states: { idle: {} } })
  new Proxy(machine, {}).start().stop()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect([machine.stopping, machine.lifecycleVersion, machine.exitingState]).toEqual(['user', 42, 'user'])
})

it('does not delete a replacement actor installed by the old actor cleanup', () => {
  const parent = createMachine({ initial: 'idle', states: { idle: {} } }).start()
  const replacement = createMachine({ id: 'same', initial: 'idle', states: { idle: {} } })
  const old = createMachine({ id: 'same', initial: 'idle', activities: [() => () => parent.spawn(replacement)], states: { idle: {} } })
  parent.spawn(old)
  parent.stopChild('same')
  expect(old.status).toBe(MachineStatus.Stopped)
  expect(replacement.status).toBe(MachineStatus.Running)
  expect(() => parent.sendChild('NOOP', 'same')).not.toThrow()
  parent.stop()
  expect(replacement.status).toBe(MachineStatus.Stopped)
})

it('retries a throwing disposer returned after its activity stopped the run', () => {
  const error = new Error('late cleanup')
  let attempts = 0
  const machine = createMachine({ initial: 'idle', activities: [(_ctx, _evt, { self }) => {
    self.stop()
    return () => {
      if (++attempts === 1)
        throw error
    }
  }], states: { idle: {} } })
  expect(() => machine.start()).toThrow(error)
  expect(machine.status).toBe(MachineStatus.Stopped)
  machine.stop()
  expect(attempts).toBe(2)
  machine.stop()
  expect(attempts).toBe(2)
})

it('does not let a retired failed stop phase skip teardown of a restarted run', () => {
  let first = true
  let active = 0
  const failure = new Error('outer exit failed')
  const machine = createMachine({
    initial: 'idle',
    activities: [() => {
      active++
      return () => {
        active--
      }
    }],
    exit: () => {
      if (first) {
        first = false
        machine.stop()
        throw failure
      }
    },
    states: { idle: {} },
  }).start()
  expect(() => machine.stop()).toThrow(failure)
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(active).toBe(0)
  machine.start()
  expect(active).toBe(1)
  machine.stop()
  expect(machine.status).toBe(MachineStatus.Stopped)
  expect(active).toBe(0)
})
