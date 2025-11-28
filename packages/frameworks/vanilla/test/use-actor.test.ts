import { createMachine } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useService } from '../src/hooks/use-service'

describe('vanilla useActor', () => {
  it('returns snapshot and send, staying in sync with service updates', () => {
    const machine = createMachine({
      id: 'vanilla.actor',
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { GO: 'done' } },
        done: {},
      },
    })

    const target = {}
    const service = useService(target, machine)
    const [state, send] = useActor(target, service)

    expect(state.value).toBe('idle')

    send({ type: 'GO' } as any)
    expect(service.getState().value).toBe('done')
  })
})
