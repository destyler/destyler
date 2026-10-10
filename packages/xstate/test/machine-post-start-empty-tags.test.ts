import { describe, expect, it } from 'vitest'
import { createMachine, proxy, ref } from '../index'

describe('post-start empty-string tag residual', () => {
  it('preserves an empty-string tag through start, stop, restart and hydration', () => {
    const machine = createMachine({ initial: 'idle', states: { idle: { tags: '' } } })
    const before = machine.getState()
    machine.start()
    const after = machine.getState()
    machine.stop()
    const stopped = machine.getState()
    machine.start()
    const restarted = machine.getState()
    const hydration = machine.getHydrationState()
    machine.stop()
    expect(before.tags).toEqual([''])
    expect(after.tags).toEqual([''])
    expect(after.hasTag('')).toBe(true)
    expect(stopped.tags).toEqual([])
    expect(restarted.tags).toEqual([''])
    expect(hydration.tags).toEqual([''])
  })
  it('keeps shorthand and array empty-string tags equivalent across transitions', () => {
    const machine = createMachine({ initial: 'idle', states: {
      idle: { tags: 'ready', on: { GO: 'empty' } },
      empty: { tags: '', on: { GO: 'array' } },
      array: { tags: [''], on: { GO: 'none' } },
      none: {},
    } }).start()
    machine.send('GO')
    const shorthand = machine.getState()
    machine.send('GO')
    const array = machine.getState()
    machine.send('GO')
    const none = machine.getState()
    machine.stop()
    expect(shorthand.tags).toEqual(array.tags)
    expect(shorthand.hasTag('')).toBe(true)
    expect(none.tags).toEqual([])
  })
  it.each([
    ['ordinary', () => ['ready']],
    ['proxy', () => proxy(['ready'])],
    ['ref', () => ref(['ready'])],
  ] as const)('preserves post-start copying for %s arrays', (_kind, createTags) => {
    const tags = createTags()
    const machine = createMachine({ initial: 'idle', states: { idle: { tags } } }).start()
    expect(machine.state.tags).not.toBe(tags)
    tags.push('configured')
    expect(machine.state.tags).toEqual(['ready'])
    machine.state.tags.push('local')
    expect(tags).toEqual(['ready', 'configured'])
    machine.stop()
    machine.start()
    expect(machine.state.tags).toEqual(['ready', 'configured'])
    machine.stop()
  })
})
