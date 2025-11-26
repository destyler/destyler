import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { useMachine } from '../src/use-machine'

describe('vanilla useMachine', () => {
  it('starts the machine with provided context and actions', () => {
    const actions = {
      inc: vi.fn(),
    }

    const machine = createMachine({
      id: 'vanilla.machine',
      initial: 'ready',
      context: { count: 0 },
      states: {
        ready: {
          on: {
            ADD: { target: 'ready', actions: ['inc'] },
            FINISH: 'done',
          },
        },
        done: {},
      },
    })

    const { state, send, service } = useMachine(machine, {
      context: { count: 1 },
      actions,
    })

    expect(service.status).toBe(MachineStatus.Running)
    expect(state.context.count).toBe(1)

    send({ type: 'ADD' } as any)
    expect(actions.inc).toHaveBeenCalledTimes(1)

    send({ type: 'FINISH' } as any)
    expect(service.getState().value).toBe('done')
  })
})
