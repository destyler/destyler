import { describe, expect, it, vi } from 'vitest'
import { ActionTypes, createMachine, MachineStatus } from '../index'

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

  it('clears completion when restarting without resetting context or altering old snapshots', () => {
    const done = vi.fn()
    const machine = createMachine({ context: { count: 0 }, initial: 'idle', states: {
      idle: { on: { FINISH: { target: 'complete', actions: (ctx) => { ctx.count++ } } } },
      complete: { type: 'final' },
    } }).onDone(done)

    machine.start().send('FINISH')
    expect(machine.status).toBe(MachineStatus.Stopped)
    expect(done).toHaveBeenCalledTimes(1)
    const completed = done.mock.calls[0][0]
    expect(completed.done).toBe(true)

    machine.start()
    expect(machine.status).toBe(MachineStatus.Running)
    expect(machine.getState().done).toBe(false)
    expect(machine.state.context.count).toBe(1)
    expect(completed.done).toBe(true)
    expect(completed.context.count).toBe(1)

    machine.send('FINISH')
    expect(done).toHaveBeenCalledTimes(2)
    expect(done.mock.calls[1][0].done).toBe(true)
    expect(machine.state.context.count).toBe(2)
  })

  it('clears completion before root entry on each immediately-final run', () => {
    const observed: boolean[] = []
    const machine = createMachine({
      initial: 'complete',
      entry: (_ctx, _event, { state }) => observed.push(state.done),
      states: { complete: { type: 'final' } },
    })

    machine.start()
    expect(machine.state.done).toBe(true)
    machine.start()
    expect(machine.state.done).toBe(true)
    expect(observed).toEqual([false, false])
  })
})
