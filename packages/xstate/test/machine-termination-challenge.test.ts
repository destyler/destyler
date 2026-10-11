// @vitest-environment happy-dom

import { createMachine, MachineStatus, subscribe } from '@destyler/xstate'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { groupMachine } from '../../components/toast/src/group.machine'
import { createToastMachine } from '../../components/toast/src/machine'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})
function setup(kind = 'normal') {
  const order: string[] = []
  const group = groupMachine({ id: 'group' }).start()
  const template = createToastMachine({ id: 'toast', duration: 10, removeDelay: 5 })
  let config: any = template.config
  if (kind === 'json')
    config = JSON.parse(JSON.stringify(config))
  if (kind === 'rebuilt') {
    const t = config.states.dismissing.after.REMOVE_DELAY
    config.states.dismissing.after.REMOVE_DELAY = { target: t.target, actions: t.actions }
  }
  if (kind === 'string-key-copy') {
    const copy = (v: any): any => Array.isArray(v) ? v.map(copy) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])) : v
    config = copy(config)
  }
  const toast: any = createMachine(config, template.options)
  toast.setContext({ onStatusChange: ({ status }: any) => order.push(status) })
  toast.setOptions({ activities: { trackHeight: () => () => order.push('cleanup') } })
  toast.onDone(() => order.push('done'))
  group.state.context.toasts = [group.spawn(toast)]
  return { group, toast, order }
}
it.each(['normal', 'json', 'rebuilt', 'string-key-copy'])('retains Toast final lifecycle with %s public config', (kind) => {
  const { group, toast, order } = setup(kind)
  vi.advanceTimersByTime(15)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'unmounted', 'done'])
  expect(toast.state.value).toBe('unmounted')
  expect(toast.state.done).toBe(true)
  group.stop()
})
it('retains extra transition actions after parent removal', () => {
  const { group, toast, order } = setup()
  toast.config.states.dismissing.after.REMOVE_DELAY.actions = ['notifyParentToRemove', () => order.push('after-removal')]
  vi.advanceTimersByTime(15)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'after-removal', 'unmounted', 'done'])
  group.stop()
})
it('does not finalize the stale run after synchronous subscriber restarts during final state write', () => {
  const { group, toast, order } = setup()
  let restarted = false
  const off = subscribe(toast.state, () => {
    if (!restarted && toast.state.value === 'unmounted') {
      restarted = true
      toast.start({ value: 'visible:persist' })
      order.push('restarted')
    }
  }, true)
  vi.advanceTimersByTime(15)
  off()
  expect(restarted).toBe(true)
  expect(toast.status).toBe(MachineStatus.Running)
  expect(toast.state.value).toBe('visible:persist')
  expect(toast.state.done).toBe(false)
  expect(order).not.toContain('unmounted')
  expect(order).not.toContain('done')
  toast.stop()
  group.stop()
})
it('keeps all state listeners and context watch alive when stop throws and remains Running', async () => {
  const watched = vi.fn()
  const first = vi.fn()
  const second = vi.fn()
  let fail = true
  const machine = createMachine({ initial: 'idle', context: { count: 0 }, watch: { count: watched }, exit: () => {
    if (fail) {
      fail = false
      throw new Error('stop failed')
    }
  }, states: { idle: {} } }, { sync: true }).start()
  machine.subscribe(first)
  machine.subscribe(second)
  expect(() => machine.stop()).toThrow('stop failed')
  expect(machine.status).toBe(MachineStatus.Running)
  first.mockClear()
  second.mockClear()
  machine.setContext({ count: 1 })
  await Promise.resolve()
  await Promise.resolve()
  expect(watched).toHaveBeenCalledTimes(1)
  expect(first.mock.calls.length).toBeGreaterThan(0)
  expect(second.mock.calls.length).toBe(first.mock.calls.length)
  machine.stop()
})
it('notifies subsequent onDone callbacks when first listener only stops the completed run', () => {
  const order: string[] = []
  const parent = createMachine({ initial: 'idle', states: { idle: {} } }).start()
  const child = createMachine({ id: 'child', initial: 'idle', states: { idle: { on: { FINISH: 'done' } }, done: { type: 'final' } } })
  child.onDone(() => {
    order.push('done:first')
    child.stop()
  }).onDone(() => order.push('done:second'))
  parent.spawn(child)
  child.send('FINISH')
  let childStillKnown = false
  try {
    parent.sendChild('PING', 'child')
    childStillKnown = true
  }
  catch {
  }
  expect(order).toEqual(['done:first', 'done:second'])
  expect(childStillKnown).toBe(false)
  parent.stop()
})
it('does not invoke an action returned by a getter after that getter stops the run', () => {
  const called = vi.fn()
  const machine: any = createMachine({ initial: 'idle', states: { idle: { on: { GO: { actions: 'effect' } } } } }, { actions: { get effect() {
    machine.stop()
    return called
  } } }).start()
  machine.send('GO')
  expect(called).not.toHaveBeenCalled()
})
it('preserves named removal override using the parent send API directly', () => {
  const { group, toast, order } = setup()
  toast.setOptions({ actions: { notifyParentToRemove: () => group.send({ type: 'REMOVE_TOAST', id: toast.id }) } })
  vi.advanceTimersByTime(15)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'unmounted', 'done'])
  group.stop()
})
it('preserves finalization when parent removal override stops its actor directly', () => {
  const { group, toast, order } = setup()
  group.setOptions({ actions: { removeToast: (ctx: any, evt: any) => {
    toast.stop()
    ctx.toasts = ctx.toasts.filter((item: any) => item.id !== evt.id)
  } } })
  vi.advanceTimersByTime(15)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'unmounted', 'done'])
  group.stop()
})
it('preserves finalization when both public removal overrides use direct APIs', () => {
  const { group, toast, order } = setup()
  toast.setOptions({ actions: { notifyParentToRemove: () => group.send({ type: 'REMOVE_TOAST', id: toast.id }) } })
  group.setOptions({ actions: { removeToast: (ctx: any, evt: any) => {
    toast.stop()
    ctx.toasts = ctx.toasts.filter((item: any) => item.id !== evt.id)
  } } })
  vi.advanceTimersByTime(15)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'unmounted', 'done'])
  group.stop()
})
it('preserves synchronous exception from appended post-removal transition action', () => {
  const { group, toast, order } = setup()
  const failure = new Error('post-removal action failed')
  toast.config.states.dismissing.after.REMOVE_DELAY.actions = ['notifyParentToRemove', () => {
    order.push('throw:after-removal')
    throw failure
  }]
  let caught: unknown
  try {
    vi.advanceTimersByTime(15)
  }
  catch (error) {
    caught = error
  }
  expect(caught).toBe(failure)
  expect(order).toEqual(['visible', 'dismissing', 'cleanup', 'throw:after-removal'])
  expect(toast.state.done).toBe(false)
  group.stop()
})
it.each(['entry', 'done', 'notify'] as const)('preserves original error and catch timing for final %s callback', (kind) => {
  const { group, toast, order } = setup()
  const failure = new Error(`${kind} failure`)
  if (kind === 'entry') {
    toast.setOptions({ actions: { invokeOnUnmount: () => {
      order.push('throw:entry')
      throw failure
    } } })
  }
  if (kind === 'done') {
    toast.onDone(() => {
      order.push('throw:done')
      throw failure
    }).onDone(() => order.push('late:done'))
  }
  if (kind === 'notify') {
    const notify = toast.options.actions.notifyParentToRemove
    toast.setOptions({ actions: { notifyParentToRemove: (...args: any[]) => {
      notify(...args)
      order.push('throw:notify')
      throw failure
    } } })
  }
  let caught: unknown
  try {
    vi.advanceTimersByTime(15)
  }
  catch (error) {
    caught = error
    order.push('caught')
  }
  expect(caught).toBe(failure)
  expect(order.at(-1)).toBe('caught')
  expect(order).not.toContain('late:done')
  expect(toast.status).toBe(MachineStatus.Stopped)
  expect(toast.state.done).toBe(kind === 'done')
  group.stop()
})
it.each(['root', 'state'] as const)('does not lose pending %s exit cleanup after a nested successful stop', (location) => {
  let machine: any
  let released = false
  let nested = false
  const order: string[] = []
  const exit = [() => {
    order.push('begin')
    if (!nested) {
      nested = true
      machine.stop()
    }
  }, () => {
    released = true
    order.push('release')
  }]
  machine = createMachine({ initial: 'idle', exit: location === 'root' ? exit : undefined, states: { idle: { exit: location === 'state' ? exit : undefined } } }).start()
  machine.stop()
  expect(released).toBe(true)
  expect(machine.status).toBe(MachineStatus.Stopped)
})
it('keeps failed in-flight child teardown recoverable after a nested parent stop completes', () => {
  const error = new Error('child exit failed after nested parent stop')
  let nested = false
  let attempts = 0
  let active = 0
  const parent = createMachine({ initial: 'idle', states: { idle: {} } }).start()
  const child = createMachine({ id: 'child', initial: 'idle', activities: [() => {
    active++
    return () => {
      active--
    }
  }], exit: () => {
    attempts++
    if (!nested) {
      nested = true
      parent.stop()
      throw error
    }
  }, states: { idle: {} } })
  parent.spawn(child)
  expect(() => parent.stop()).toThrow(error)
  parent.stop()
  expect(attempts).toBeGreaterThan(0)
  expect(child.status).toBe(MachineStatus.Stopped)
  expect(active).toBe(0)
})
it.each(['root', 'state'] as const)('keeps pending %s exit cleanup recoverable when its in-flight callback throws after nested stop', (location) => {
  let machine: any
  const error = new Error('exit failed after nested stop')
  let released = false
  let nested = false
  const order: string[] = []
  const exit = [() => {
    order.push('begin')
    if (!nested) {
      nested = true
      machine.stop()
      throw error
    }
  }, () => {
    released = true
    order.push('release')
  }]
  machine = createMachine({ initial: 'idle', exit: location === 'root' ? exit : undefined, states: { idle: { exit: location === 'state' ? exit : undefined } } }).start()
  expect(() => machine.stop()).toThrow(error)
  machine.stop()
  expect(released).toBe(true)
  expect(machine.status).toBe(MachineStatus.Stopped)
})
it.each(['root', 'state'] as const)('uses current named %s exit override on explicit retry after failure', (location) => {
  const error = new Error('old exit override')
  const oldExit = vi.fn(() => {
    throw error
  })
  const newExit = vi.fn()
  const machine = createMachine({ initial: 'idle', exit: location === 'root' ? 'exit' : undefined, states: { idle: { exit: location === 'state' ? 'exit' : undefined } } }, { actions: { exit: oldExit } }).start()
  expect(() => machine.stop()).toThrow(error)
  machine.setOptions({ actions: { exit: newExit } })
  expect(() => machine.stop()).not.toThrow()
  expect(oldExit).toHaveBeenCalledTimes(1)
  expect(newExit).toHaveBeenCalledTimes(1)
  expect(machine.status).toBe(MachineStatus.Stopped)
})
it.each(['root', 'state'] as const)('executes each %s exit callback exactly once during recursive stop', (location) => {
  let machine: any
  let nested = false
  const order: string[] = []
  const exit = [() => {
    order.push('begin')
    if (!nested) {
      nested = true
      machine.stop()
    }
  }, () => order.push('release')]
  machine = createMachine({ initial: 'idle', exit: location === 'root' ? exit : undefined, states: { idle: { exit: location === 'state' ? exit : undefined } } }).start()
  machine.stop()
  expect(order).toEqual(['begin', 'release'])
})
it.each(['source-exit', 'final-activity'] as const)('preserves successful same-run final notification when stopped from %s', (location) => {
  let machine: any
  const order: string[] = []
  let nested = false
  const stopOnce = () => {
    if (!nested) {
      nested = true
      machine.stop()
    }
  }
  machine = createMachine({ initial: 'idle', states: { idle: { exit: location === 'source-exit' ? stopOnce : undefined, on: { FINISH: 'done' } }, done: { type: 'final', activities: location === 'final-activity' ? [stopOnce] : undefined, entry: () => order.push('entry') } } }).onDone(() => order.push('done')).start()
  machine.send('FINISH')
  expect(order).toEqual(['entry', 'done'])
  expect(machine.state.done).toBe(true)
})
it('releases all final activities acquired across a successful same-run stop', () => {
  let active = 0
  const order: string[] = []
  const machine = createMachine({ initial: 'idle', states: { idle: { on: { FINISH: 'done' } }, done: { type: 'final', activities: [() => {
    active++
    machine.stop()
    return () => {
      active--
      order.push('cleanup:1')
    }
  }, () => {
    active++
    return () => {
      active--
      order.push('cleanup:2')
    }
  }] } } }).onDone(() => order.push('done')).start()
  machine.send('FINISH')
  machine.stop()
  expect(order).toContain('done')
  expect(active).toBe(0)
  expect(order.filter(x => x.startsWith('cleanup'))).toHaveLength(2)
})
it('clears final intervals created after their delay resolver successfully stops the run', () => {
  const tick = vi.fn()
  const done = vi.fn()
  const machine = createMachine({ initial: 'idle', states: { idle: { on: { FINISH: 'done' } }, done: { type: 'final', every: { INTERVAL: tick } } } }, { delays: { INTERVAL: () => {
    machine.stop()
    return 10
  } } }).onDone(done).start()
  machine.send('FINISH')
  vi.advanceTimersByTime(20)
  expect(done).toHaveBeenCalledTimes(1)
  expect(vi.getTimerCount()).toBe(0)
  expect(tick).not.toHaveBeenCalled()
})
it.each(['root', 'state'] as const)('cleans the restarted run after an earlier nested %s stop completed then threw', (location) => {
  let machine: any
  const error = new Error('old stop failure')
  let active = 0
  let acquired = 0
  let cleaned = 0
  let nested = false
  const exit = () => {
    if (!nested) {
      nested = true
      machine.stop()
      throw error
    }
  }
  const activity = () => {
    active++
    acquired++
    return () => {
      active--
      cleaned++
    }
  }
  machine = createMachine({ initial: 'idle', activities: [activity], exit: location === 'root' ? exit : undefined, states: { idle: { exit: location === 'state' ? exit : undefined } } }).start()
  expect(() => machine.stop()).toThrow(error)
  expect(active).toBe(0)
  machine.start()
  expect(active).toBe(1)
  machine.stop()
  machine.stop()
  expect(active).toBe(0)
  expect(acquired).toBe(2)
  expect(cleaned).toBe(2)
  expect(machine.status).toBe(MachineStatus.Stopped)
})
