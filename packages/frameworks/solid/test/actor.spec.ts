import { createMachine } from '@destyler/xstate'
import { createEffect } from 'solid-js'
import { render } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useService } from '../src/hooks/use-service'

const tick = () => new Promise(resolve => setTimeout(resolve, 0))

describe('solid useActor', () => {
  it('mirrors service state and forwards send', async () => {
    const machine = createMachine({
      id: 'solid.actor',
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { GO: 'done' } },
        done: {},
      },
    })

    let lastValue = ''
    let send!: (evt: any) => void

    const dispose = render(() => {
      const service = useService(machine)
      const [state, sendFn] = useActor(service)
      send = sendFn
      createEffect(() => {
        lastValue = state.value
      })
      return null
    }, document.createElement('div'))

    await tick()
    expect(lastValue).toBe('idle')

    send({ type: 'GO' } as any)
    await tick()
    expect(lastValue).toBe('done')

    dispose()
  })
})
