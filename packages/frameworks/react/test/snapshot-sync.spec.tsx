import { createMachine } from '@destyler/xstate'
import { act, createElement } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { useMachine, useService } from '../index'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe.each([false, true])('snapshot notification timing (sync: %s)', (sync) => {
  it.each(['useMachine', 'useSnapshot'] as const)('preserves the notification option through %s', async (api) => {
    const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } })
    const container = document.createElement('div')
    const root = createRoot(container)
    function Public() {
      const [state] = useMachine(service, { sync })
      return createElement('output', null, state.context.count)
    }
    function Direct() {
      const actor = useService(service)
      const state = useSnapshot(actor, { sync })
      return createElement('output', null, state.context.count)
    }
    try {
      await act(async () => root.render(createElement(api === 'useMachine' ? Public : Direct)))
      expect(container.textContent).toBe('0')
      await act(async () => {
        flushSync(() => service.setContext({ count: 1 }))
        expect(container.textContent).toBe(sync ? '1' : '0')
      })
      expect(container.textContent).toBe('1')
    }
    finally {
      await act(async () => root.unmount())
    }
  })
})

it('resubscribes when the public sync option changes without replacing the service', async () => {
  const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } })
  const container = document.createElement('div')
  const root = createRoot(container)
  function View({ sync }: { sync: boolean }) {
    const [state, , actor] = useMachine(service, { sync })
    expect(actor).toBe(service)
    return createElement('output', null, state.context.count)
  }
  try {
    await act(async () => root.render(createElement(View, { sync: false })))
    await act(async () => root.render(createElement(View, { sync: true })))
    await act(async () => {
      flushSync(() => service.setContext({ count: 1 }))
      expect(container.textContent).toBe('1')
    })
    await act(async () => root.render(createElement(View, { sync: false })))
    await act(async () => {
      flushSync(() => service.setContext({ count: 2 }))
      expect(container.textContent).toBe('1')
    })
    expect(container.textContent).toBe('2')
  }
  finally {
    await act(async () => root.unmount())
  }
})
