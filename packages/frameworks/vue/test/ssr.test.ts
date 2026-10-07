import { subscribe } from '@destyler/store'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useMachine } from '../src/composition/machine'

vi.mock('@destyler/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@destyler/store')>()
  return { ...actual, subscribe: vi.fn(actual.subscribe) }
})

describe('vue server rendering', () => {
  it('renders initialized context without acquiring subscriptions or starting effects', async () => {
    const entry = vi.fn()
    const activity = vi.fn()
    const machine = createMachine({
      id: 'vue.ssr.lifecycle',
      initial: 'idle',
      context: { count: 0 },
      created: ctx => ctx.count++,
      entry,
      activities: activity,
      states: { idle: {} },
    })
    const start = vi.spyOn(machine, 'start')
    const stop = vi.spyOn(machine, 'stop')
    vi.mocked(subscribe).mockClear()

    const app = createSSRApp({
      setup() {
        const [state] = useMachine(machine)
        return () => h('output', state.value.context.count)
      },
    })

    expect(await renderToString(app)).toBe('<output>1</output>')
    expect(machine.status).toBe(MachineStatus.NotStarted)
    expect(start).not.toHaveBeenCalled()
    expect(stop).not.toHaveBeenCalled()
    expect(entry).not.toHaveBeenCalled()
    expect(activity).not.toHaveBeenCalled()
    expect(subscribe).not.toHaveBeenCalled()
  })
})
