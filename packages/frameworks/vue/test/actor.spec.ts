import { createMachine } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, watch } from 'vue'
import { useActor } from '../src/composition/actor'
import { useService } from '../src/composition/service'

const flush = () => new Promise(resolve => setTimeout(resolve))

describe('vue useActor', () => {
  it('returns reactive snapshot and send function from a running service', async () => {
    const machine = createMachine({
      id: 'vue.actor',
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { GO: 'active' } },
        active: {},
      },
    })

    const stateValue = ref<string | null>(null)
    let send!: (evt: any) => void

    const app = createApp(
      defineComponent({
        setup() {
          const service = useService(machine)
          const [state, sendFn] = useActor(service)
          send = sendFn

          // mirror state.value into a ref we can assert after ticks
          watch(
            () => state.value.value,
            (v) => {
              stateValue.value = v
            },
            { immediate: true },
          )

          return () => {
            return h('div')
          }
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)
    await nextTick()

    expect(stateValue.value).toBe('idle')

    send({ type: 'GO' } as any)
    await nextTick()
    await flush()

    expect(stateValue.value).toBe('active')
    app.unmount()
  })
})
