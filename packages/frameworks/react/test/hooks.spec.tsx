import { createMachine, MachineStatus } from '@destyler/xstate'
import React, { act, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { useMachine } from '../src/hooks/use-machine'

// React 18 warns when act isn't explicitly enabled in non-RTL environments.
// @ts-expect-error - testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react hooks', () => {
  it('starts the service and tears down on unmount', async () => {
    const machine = createMachine({
      id: 'react.lifecycle',
      initial: 'idle',
      context: {},
      states: {
        idle: {
          on: { NEXT: 'active' },
        },
        active: {},
      },
    })

    const startSpy = vi.spyOn(machine, 'start')
    const stopSpy = vi.spyOn(machine, 'stop')

    const container = document.createElement('div')
    const root = createRoot(container)

    let latestState: any
    let send!: (evt: any) => void

    function Test() {
      const [state, sendFn] = useMachine(machine)
      useEffect(() => {
        latestState = state
        send = sendFn
      }, [state, sendFn])
      return null
    }

    await act(async () => {
      root.render(<Test />)
    })

    expect(startSpy).toHaveBeenCalledTimes(1)
    expect(machine.status).toBe(MachineStatus.Running)

    await act(async () => {
      send({ type: 'NEXT' })
    })

    expect(latestState.value).toBe('active')

    await act(async () => {
      root.unmount()
    })

    expect(stopSpy).toHaveBeenCalledTimes(1)
  })

  it('applies context updates passed through options', async () => {
    const machine = createMachine({
      id: 'react.context',
      initial: 'idle',
      context: { count: 0 },
      states: {
        idle: {},
      },
    })

    const setContextSpy = vi.spyOn(machine, 'setContext')

    const container = document.createElement('div')
    const root = createRoot(container)

    let updateCtx!: React.Dispatch<React.SetStateAction<{ count: number }>>
    let latestService: typeof machine | undefined

    function Wrapper() {
      const [ctx, setCtx] = useState({ count: 0 })
      const [, , service] = useMachine(machine, { context: ctx })

      useEffect(() => {
        updateCtx = setCtx
        latestService = service
      }, [service])

      return null
    }

    await act(async () => {
      root.render(<Wrapper />)
    })

    expect(setContextSpy).toHaveBeenCalledWith({ count: 0 })

    await act(async () => {
      updateCtx({ count: 5 })
    })

    expect(setContextSpy).toHaveBeenLastCalledWith({ count: 5 })
    expect(latestService?.contextSnapshot.count).toBe(5)

    await act(async () => {
      root.unmount()
    })
  })
})
