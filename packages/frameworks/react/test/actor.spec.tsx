import { createMachine } from '@destyler/xstate'
import { act, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useService } from '../src/hooks/use-service'

// React act flag for environments without RTL.
// @ts-expect-error - testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react useActor', () => {
  it('subscribes to service state and exposes send', async () => {
    const machine = createMachine({
      id: 'react.actor',
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { GO: 'done' } },
        done: {},
      },
    })

    const sendSpy = vi.spyOn(machine, 'send')

    let stateValue: string | null = null
    let send!: (evt: any) => void

    function Test() {
      const service = useService(machine)
      const [state, sendFn] = useActor(service)

      useEffect(() => {
        stateValue = state.value
        send = sendFn
      }, [state, sendFn])

      return null
    }

    const container = document.createElement('div')
    const root = createRoot(container)

    await act(async () => {
      root.render(<Test />)
    })

    expect(stateValue).toBe('idle')

    await act(async () => {
      send({ type: 'GO' } as any)
    })

    expect(sendSpy).toHaveBeenCalled()
    expect(stateValue).toBe('done')

    await act(async () => {
      root.unmount()
    })
  })
})
