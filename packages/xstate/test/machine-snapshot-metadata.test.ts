import { describe, expect, it } from 'vitest'
import { ActionTypes, createMachine } from '../index'

describe('machine snapshot metadata', () => {
  it('normalizes shorthand initial tags before start and in hydration state', () => {
    const machine = createMachine({ initial: 'idle', states: { idle: { tags: 'ready' } } })
    const state = machine.getState()

    expect(state.tags).toEqual(['ready'])
    expect(state.hasTag('ready')).toBe(true)
    expect(state.hasTag('read')).toBe(false)
    expect(machine.getHydrationState()).toEqual({ value: 'idle', tags: ['ready'] })
    machine.start()
    expect(machine.getState().tags).toEqual(['ready'])
    machine.stop()
  })

  it.each([undefined, ['ready', 'interactive']])('preserves empty and array initial tags: %s', (tags) => {
    const machine = createMachine({ initial: 'idle', states: { idle: { tags } } })
    const state = machine.getState()

    expect(state.tags).toEqual(tags ?? [])
    expect(state.hasTag('read')).toBe(false)
    expect(state.hasTag('ready')).toBe(tags !== undefined)
  })

  it('does not treat an ordinary value payload as the initialization event', () => {
    const machine = createMachine({ initial: 'idle', states: {
      idle: { on: { GO: 'active' } },
      active: {},
    } }).start()

    machine.send({ type: 'GO', value: ActionTypes.Init })
    expect(machine.state.value).toBe('active')
    expect(machine.getState().changed).toBe(true)
    machine.stop()
  })

  it('marks the first hydrated state as an unchanged initialization snapshot', () => {
    const machine = createMachine({ initial: 'idle', states: { idle: {}, active: {} } })

    machine.start({ value: 'active' })
    expect(machine.state.value).toBe('active')
    expect(machine.state.event.type).toBe(ActionTypes.Init)
    expect(machine.getState().changed).toBe(false)
    machine.stop()
  })
})
