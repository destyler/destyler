import { describe, expect, it } from 'vitest'
import { createMachine, proxy, ref } from '../index'

function createTaggedMachine(tags: string | string[]) {
  return createMachine({ initial: 'idle', states: { idle: { tags } } })
}

describe('initial tag compatibility', () => {
  it('keeps empty-string shorthand as a complete tag before start and during hydration', () => {
    const machine = createTaggedMachine('')

    expect(machine.state.tags).toEqual([''])
    expect(machine.getState().tags).toEqual([''])
    expect(machine.getState().hasTag('')).toBe(true)
    expect(machine.getHydrationState()).toEqual({ value: 'idle', tags: [''] })
  })

  it('preserves ordinary array mutation separation before start', () => {
    const tags = ['ready']
    const machine = createTaggedMachine(tags)
    const previous = machine.getState()

    tags.push('configured')
    expect(machine.getState()).toBe(previous)
    expect(machine.state.tags).toEqual(['ready'])
    machine.state.tags.push('local')
    expect(tags).toEqual(['ready', 'configured'])
    expect(previous.tags).toEqual(['ready'])
    expect(machine.getState().tags).toEqual(['ready', 'local'])
    machine.start()
    expect(machine.getState().tags).toEqual(['ready', 'configured'])
    machine.stop()
  })

  it.each([
    ['proxy', () => proxy(['ready'])],
    ['ref', () => ref(['ready'])],
  ] as const)('preserves %s config-to-state tag updates before start', (_kind, createTags) => {
    const tags = createTags()
    const machine = createTaggedMachine(tags)

    expect(machine.state.tags).toBe(tags)
    tags.push('later')
    expect(machine.getState().tags).toEqual(['ready', 'later'])
    expect(machine.getHydrationState().tags).toEqual(['ready', 'later'])
    machine.start()
    expect(machine.getState().tags).toEqual(['ready', 'later'])
    machine.stop()
  })

  it.each([
    ['proxy', () => proxy(['ready'])],
    ['ref', () => ref(['ready'])],
  ] as const)('preserves %s state-to-config tag updates used by start', (_kind, createTags) => {
    const tags = createTags()
    const machine = createTaggedMachine(tags)

    machine.state.tags.push('later')
    expect(tags).toEqual(['ready', 'later'])
    expect(machine.config.states?.idle?.tags).toEqual(['ready', 'later'])
    machine.start()
    expect(machine.getState().tags).toEqual(['ready', 'later'])
    machine.stop()
  })

  it('preserves shared pre-start state for machines using the same ordinary tag array', () => {
    const tags = ['ready']
    const first = createTaggedMachine(tags)
    const second = createTaggedMachine(tags)

    expect(first.state.tags).toBe(second.state.tags)
    first.state.tags.push('later')
    expect(second.getState().tags).toEqual(['ready', 'later'])
    expect(tags).toEqual(['ready'])
    first.start()
    second.start()
    expect(first.getState().tags).toEqual(['ready'])
    expect(second.getState().tags).toEqual(['ready'])
    expect(first.state.tags).not.toBe(second.state.tags)
    first.stop()
    second.stop()
  })

  it('preserves lazy array element accessors through construction', () => {
    let value = 'ready'
    let reads = 0
    const tags: string[] = []
    Object.defineProperty(tags, '0', {
      get() {
        reads++
        return value
      },
      enumerable: true,
      configurable: true,
    })
    const machine = createTaggedMachine(tags)

    expect(reads).toBe(0)
    expect(Object.getOwnPropertyDescriptor(machine.state.tags, '0')?.get).toBeTypeOf('function')
    value = 'later'
    expect(machine.getState().tags).toEqual(['later'])
    expect(machine.getHydrationState().tags).toEqual(['later'])
  })
})
