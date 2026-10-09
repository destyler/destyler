// @vitest-environment happy-dom
import { createMachine, Machine, MachineStatus } from '@destyler/xstate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { groupMachine } from '../src/group.machine'
import { createToastMachine } from '../src/machine'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function setup(copy: 'none' | 'config' | 'spread' = 'none') {
  const trace: string[] = []
  const group = groupMachine({ id: 'group' }).start()
  const original = createToastMachine({ id: 'toast', duration: 10, removeDelay: 5, onStatusChange: ({ status }) => trace.push(`status:${status}`) })
  const toast = copy === 'none'
    ? original
    : createMachine(copy === 'spread' ? { ...original.config } : original.config, copy === 'spread' ? { ...original.options } : original.options)
  toast.setOptions({ activities: { trackHeight: () => () => trace.push('cleanup') } })
  const notify = toast.options.actions!.notifyParentToRemove as any
  const unmount = toast.options.actions!.invokeOnUnmount as any
  const remove = group.options.actions!.removeToast as any
  toast.setOptions({ actions: {
    notifyParentToRemove(...args: any[]) {
      trace.push('notify:before')
      notify(...args)
      trace.push('notify:after')
    },
    invokeOnUnmount(...args: any[]) {
      trace.push('unmount:before')
      expect(toast.status).toBe(MachineStatus.Stopped)
      expect(toast.state.value).toBe('unmounted')
      expect(toast.state.done).toBe(false)
      expect(group.state.context.toasts).toHaveLength(0)
      unmount(...args)
      trace.push('unmount:after')
    },
  } })
  group.setOptions({ actions: {
    removeToast(...args: any[]) {
      trace.push('remove:before')
      remove(...args)
      trace.push('remove:after')
    },
  } })
  toast.onDone((state) => {
    expect(state.value).toBe('unmounted')
    expect(state.done).toBe(true)
    expect(toast.status).toBe(MachineStatus.Stopped)
    trace.push('done:1')
  }).onDone(() => trace.push('done:2'))
  const actor = group.spawn(toast)
  group.state.context.toasts = [actor]
  return { trace, group, toast }
}

describe('toast retirement compatibility', () => {
  it.each(['none', 'config', 'spread'] as const)('preserves cleanup, named overrides and final notification order (%s)', (copy) => {
    const { group, toast, trace } = setup(copy)
    vi.advanceTimersByTime(15)
    expect(trace).toEqual([
      'status:visible',
      'status:dismissing',
      'notify:before',
      'remove:before',
      'cleanup',
      'remove:after',
      'notify:after',
      'unmount:before',
      'status:unmounted',
      'unmount:after',
      'done:1',
      'done:2',
    ])
    expect(toast.status).toBe(MachineStatus.Stopped)
    expect(toast.state.value).toBe('unmounted')
    expect(toast.state.done).toBe(true)
    expect(group.state.context.toasts).toHaveLength(0)
    expect(vi.getTimerCount()).toBe(0)
    group.stop()
  })

  it('keeps an override that does not remove the actor as a normal final transition', () => {
    const order: string[] = []
    const toast = createToastMachine({ id: 'toast', duration: 10, removeDelay: 5 })
    toast.setOptions({
      activities: { trackHeight: () => () => order.push('cleanup') },
      actions: {
        notifyParentToRemove: () => order.push('notify'),
        invokeOnUnmount: () => order.push('unmounted'),
      },
    })
    toast.onDone((state) => {
      expect(state.value).toBe('unmounted')
      expect(state.done).toBe(true)
      expect(toast.status).toBe(MachineStatus.Running)
      order.push('done')
    }).start()
    vi.advanceTimersByTime(15)
    expect(order).toEqual(['notify', 'unmounted', 'done', 'cleanup'])
    expect(toast.status).toBe(MachineStatus.Stopped)
  })

  it.each(['direct', 'remove', 'remove-all', 'parent-stop'] as const)('propagates the first cleanup failure synchronously and retains retry ownership (%s)', (route) => {
    const { group, toast, trace } = setup()
    let attempts = 0
    const error = new Error(`cleanup ${route}`)
    toast.stop()
    toast.setOptions({ activities: { trackHeight: () => () => {
      trace.push('cleanup:attempt')
      if (++attempts === 1)
        throw error
    } } })
    toast.start()
    trace.length = 0
    const cancel = () => {
      if (route === 'direct')
        toast.stop()
      else if (route === 'remove')
        group.send({ type: 'REMOVE_TOAST', id: toast.id })
      else if (route === 'remove-all')
        group.send('REMOVE_ALL')
      else group.stop()
    }
    expect(cancel).toThrow(error)
    expect(attempts).toBe(1)
    expect(trace).not.toContain('status:unmounted')
    expect(trace).not.toContain('done:1')
    cancel()
    expect(attempts).toBe(2)
    expect(toast.status).toBe(MachineStatus.Stopped)
    group.stop()
  })

  it('preserves caller catch timing inside a removal override', () => {
    const { group, toast, trace } = setup()
    const remove = group.options.actions!.removeToast as any
    const error = new Error('cleanup')
    toast.stop()
    let attempts = 0
    toast.setOptions({ activities: { trackHeight: () => () => {
      if (++attempts === 1)
        throw error
    } } })
    toast.start()
    group.setOptions({ actions: { removeToast(...args: any[]) {
      trace.push('before')
      try {
        remove(...args)
      }
      catch (caught) {
        expect(caught).toBe(error)
        trace.push('caught')
        throw caught
      }
      trace.push('after')
    } } })
    expect(() => vi.advanceTimersByTime(15)).toThrow(error)
    expect(trace.slice(-3)).toEqual(['notify:before', 'before', 'caught'])
    expect(trace).not.toContain('done:1')
    group.send({ type: 'REMOVE_TOAST', id: toast.id })
    expect(attempts).toBe(2)
    group.stop()
  })

  it('does not complete an old Toast run after the removal action stops and restarts it', () => {
    const { group, toast, trace } = setup()
    const notify = toast.options.actions!.notifyParentToRemove as any
    toast.setOptions({ actions: { notifyParentToRemove(...args: any[]) {
      notify(...args)
      toast.start({ value: 'visible:persist' })
    } } })
    vi.advanceTimersByTime(15)
    expect(trace).not.toContain('status:unmounted')
    expect(trace).not.toContain('done:1')
    expect(toast.state.value).toBe('visible:persist')
    expect(toast.state.done).toBe(false)
    toast.stop()
    group.stop()
  })

  it('does not remove a replacement child with the same id from a stale completion listener', () => {
    const { group, toast, trace } = setup()
    const replacement = createToastMachine({ id: toast.id, type: 'loading' })
    replacement.setOptions({ activities: { trackHeight: () => {} } })
    const unmount = toast.options.actions!.invokeOnUnmount as any
    toast.setOptions({ actions: { invokeOnUnmount(...args: any[]) {
      unmount(...args)
      const actor = group.spawn(replacement)
      group.state.context.toasts = [actor]
    } } })
    vi.advanceTimersByTime(15)
    expect(trace).toContain('done:2')
    expect(replacement.status).toBe(MachineStatus.Running)
    expect(() => group.sendChild('PAUSE', replacement.id)).not.toThrow()
    group.stop()
    expect(replacement.status).toBe(MachineStatus.Stopped)
  })
})

it.each(['foreign-instance', 'foreign-config', 'foreign-group'] as const)('preserves completion across separately loaded module copies (%s)', async (kind) => {
  vi.resetModules()
  const foreignCore = await import('@destyler/xstate')
  const foreignToast = await import('../src/machine')
  const foreignGroup = await import('../src/group.machine')
  expect(foreignCore.Machine).not.toBe(Machine)
  const groupTemplate = foreignGroup.groupMachine({ id: 'foreign-group' })
  const group = kind === 'foreign-group'
    ? createMachine(groupTemplate.config, groupTemplate.options).start()
    : groupMachine({ id: 'group' }).start()
  const template = foreignToast.createToastMachine({ id: 'toast', duration: 10, removeDelay: 5 })
  const toast = kind === 'foreign-config' ? createMachine(template.config, template.options) : template
  const cleanup = vi.fn()
  const done = vi.fn()
  toast.setOptions({ activities: { trackHeight: () => cleanup } })
  toast.onDone(done)
  group.state.context.toasts = [group.spawn(toast)]
  vi.advanceTimersByTime(15)
  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(done).toHaveBeenCalledTimes(1)
  expect(done.mock.calls[0][0].value).toBe('unmounted')
  expect(done.mock.calls[0][0].done).toBe(true)
  expect(group.state.context.toasts).toHaveLength(0)
  group.stop()
})

it('keeps distinct actors made from the same config and options independently completable', () => {
  const template = createToastMachine({ id: 'same-id', duration: 10, removeDelay: 5 })
  const actors = [createMachine(template.config, template.options), createMachine(template.config, template.options)]
  const groups = [groupMachine({ id: 'group-1' }).start(), groupMachine({ id: 'group-2' }).start()]
  const done = actors.map(() => vi.fn())
  const cleanup = actors.map(() => vi.fn())
  actors.forEach((actor, index) => {
    actor.setOptions({ activities: { trackHeight: () => cleanup[index] } })
    actor.onDone(done[index])
    groups[index].state.context.toasts = [groups[index].spawn(actor)]
  })
  vi.advanceTimersByTime(15)
  for (let i = 0; i < actors.length; i++) {
    expect(done[i]).toHaveBeenCalledTimes(1)
    expect(cleanup[i]).toHaveBeenCalledTimes(1)
    expect(groups[i].state.context.toasts).toHaveLength(0)
    expect(actors[i].state.done).toBe(true)
    groups[i].stop()
  }
})
