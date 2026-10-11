import type { Ref } from 'vue'
import { subscribe } from '@destyler/store'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { createApp, createSSRApp, h, nextTick, onBeforeMount } from 'vue'
import { useActor } from '../src/composition/actor'
import { useMachine } from '../src/composition/machine'

vi.mock('@destyler/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@destyler/store')>()
  return {
    ...actual,
    subscribe: vi.fn((...args: Parameters<typeof actual.subscribe>) => vi.fn(actual.subscribe(...args))),
  }
})

describe('vue subscription lifecycle', () => {
  it('refreshes changes made after setup and during service startup', async () => {
    const machine = createMachine({
      id: 'vue.mount-gap',
      initial: 'idle',
      context: { count: 0 },
      entry: ctx => ctx.count++,
      states: { idle: {} },
    }, { sync: true })
    const container = document.createElement('div')
    const app = createApp({
      setup() {
        const [state] = useMachine(machine)
        onBeforeMount(() => machine.setContext({ count: 7 }))
        return () => h('output', state.value.context.count)
      },
    })

    try {
      app.mount(container)
      await nextTick()
      expect(machine.contextSnapshot.count).toBe(8)
      expect(container.textContent).toBe('8')
    }
    finally {
      app.unmount()
    }
    expect(machine.status).toBe(MachineStatus.Stopped)
  })

  it('hydrates the server snapshot and observes the hydrated machine state', async () => {
    const machine = createMachine({
      id: 'vue.hydration',
      initial: 'idle',
      context: { count: 0 },
      states: { idle: {}, active: {} },
    }, { sync: true })
    const container = document.createElement('div')
    container.innerHTML = '<output>idle:0</output>'
    const serverOutput = container.firstChild
    const warnings: string[] = []
    const app = createSSRApp({
      setup() {
        const [state] = useMachine(machine, { state: { value: 'active', context: { count: 5 } } })
        return () => h('output', `${state.value.value}:${state.value.context.count}`)
      },
    })
    app.config.warnHandler = message => warnings.push(message)

    try {
      app.mount(container)
      await nextTick()
      expect(container.firstChild).toBe(serverOutput)
      expect(warnings).toEqual([])
      expect(container.textContent).toBe('active:5')

      machine.setContext({ count: 6 })
      await expect.poll(() => container.textContent).toBe('active:6')
    }
    finally {
      app.unmount()
    }
  })

  it('releases each mount subscription without stopping an externally owned actor', async () => {
    const machine = createMachine({
      id: 'vue.external-actor',
      initial: 'idle',
      context: { count: 0 },
      on: { INC: { actions: ctx => ctx.count++ } },
      states: { idle: {} },
    }, { sync: true }).start()
    const stop = vi.spyOn(machine, 'stop')

    try {
      for (let mount = 0; mount < 2; mount++) {
        let state!: Ref<ReturnType<typeof machine.getState>>
        const container = document.createElement('div')
        const app = createApp({
          setup() {
            ;[state] = useActor(machine)
            return () => h('output', state.value.context.count)
          },
        })
        app.mount(container)
        await nextTick()
        const unsubscribe = vi.mocked(subscribe).mock.results.at(-1)!.value
        expect(container.textContent).toBe(String(mount))
        expect(unsubscribe).not.toHaveBeenCalled()

        app.unmount()
        expect(unsubscribe).toHaveBeenCalledTimes(1)
        expect(stop).not.toHaveBeenCalled()
        const detached = state.value
        machine.send('INC')
        await nextTick()
        expect(machine.contextSnapshot.count).toBe(mount + 1)
        expect(state.value).toBe(detached)
        expect(state.value.context.count).toBe(mount)
      }
    }
    finally {
      machine.stop()
    }
  })
})
