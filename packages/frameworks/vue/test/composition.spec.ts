import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { useMachine } from '../src/composition/machine'
import { useService } from '../src/composition/service'

describe('vue composition adapters', () => {
  it('starts the service on mount and stops on unmount', async () => {
    const machine = createMachine({
      id: 'vue.lifecycle',
      initial: 'idle',
      context: {},
      states: {
        idle: {},
      },
    })

    const startSpy = vi.spyOn(machine, 'start')
    const stopSpy = vi.spyOn(machine, 'stop')

    const app = createApp(
      defineComponent({
        setup() {
          useService(machine)
          return () => h('div')
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)
    await nextTick()

    expect(startSpy).toHaveBeenCalledTimes(1)
    expect(machine.status).toBe(MachineStatus.Running)

    app.unmount()
    await nextTick()

    expect(stopSpy).toHaveBeenCalledTimes(1)
  })

  it('syncs actions and context updates through useMachine/useSnapshot', async () => {
    const machine = createMachine({
      id: 'vue.snapshot',
      initial: 'inactive',
      context: { ready: false },
      states: {
        inactive: {
          on: { ACTIVATE: 'active' },
        },
        active: {},
      },
    })

    const actions = { log: vi.fn() }
    const contextRef = ref({ ready: false })

    const setOptionsSpy = vi.spyOn(machine, 'setOptions')
    const setContextSpy = vi.spyOn(machine, 'setContext')

    let stateRef: ReturnType<typeof useMachine>[0] | undefined
    let send: typeof machine.send | undefined
    let service: typeof machine | undefined

    const app = createApp(
      defineComponent({
        setup() {
          const [state, sendFn, serviceRef] = useMachine(() => machine, {
            actions,
            context: contextRef,
          })

          stateRef = state
          send = sendFn
          service = serviceRef

          return () => h('div')
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)
    await nextTick()

    expect(setOptionsSpy).toHaveBeenCalledWith({ actions })
    expect(setContextSpy).toHaveBeenCalledWith(contextRef.value)

    send?.({ type: 'ACTIVATE' } as any)
    await nextTick()

    expect(stateRef?.value.value).toBe('active')

    contextRef.value = { ready: true }
    await nextTick()

    expect(setContextSpy).toHaveBeenLastCalledWith({ ready: true })
    expect(service?.contextSnapshot.ready).toBe(true)

    app.unmount()
  })
})
