import { createMachine, MachineStatus } from '@destyler/xstate'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { describe, expect, it, vi } from 'vitest'
import { useMachine } from '../src/hooks/use-machine'

const tick = () => new Promise(resolve => setTimeout(resolve, 0))

describe('solid hooks', () => {
  it('starts the service on mount and stops on cleanup', async () => {
    const machine = createMachine({
      id: 'solid.lifecycle',
      initial: 'idle',
      context: {},
      states: {
        idle: {},
      },
    })

    const startSpy = vi.spyOn(machine, 'start')
    const stopSpy = vi.spyOn(machine, 'stop')

    await new Promise<void>((resolve) => {
      const dispose = render(() => {
        useMachine(machine)
        return null
      }, document.createElement('div'))

      tick().then(() => {
        expect(startSpy).toHaveBeenCalledTimes(1)
        expect(machine.status).toBe(MachineStatus.Running)

        dispose()
        expect(stopSpy).toHaveBeenCalledTimes(1)
        resolve()
      })
    })
  })

  it('applies actions and responds to context accessors', async () => {
    const machine = createMachine({
      id: 'solid.snapshot',
      initial: 'idle',
      context: { count: 0 },
      states: {
        idle: {
          on: {
            INC: {
              target: 'idle',
              actions: ['inc'],
            },
          },
        },
      },
    })

    const inc = vi.fn()
    const setOptionsSpy = vi.spyOn(machine, 'setOptions')
    const setContextSpy = vi.spyOn(machine, 'setContext')

    await new Promise<void>((resolve) => {
      const dispose = render(() => {
        const [context, setContext] = createSignal({ count: 0 })
        const [state, send] = useMachine(machine, {
          actions: { inc },
          context,
        })

        tick()
          .then(() => {
            expect(setOptionsSpy).toHaveBeenCalledWith({ actions: { inc } })

            setContext({ count: 1 })
            return tick()
          })
          .then(() => {
            expect(setContextSpy).toHaveBeenLastCalledWith({ count: 1 })

            send({ type: 'INC' } as any)
            return tick()
          })
          .then(() => {
            expect(inc).toHaveBeenCalledTimes(1)
            expect(state.context.count).toBe(1)

            dispose()
            resolve()
          })

        return null
      }, document.createElement('div'))
    })
  })
})
