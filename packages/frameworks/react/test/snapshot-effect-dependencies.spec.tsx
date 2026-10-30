import { createMachine } from '@destyler/xstate'
import { act, createElement, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { useActor, useSelector } from '../index'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

it.each(['snapshot', 'selector'] as const)('makes machine-write feedback explicit for %s effect dependencies', async (mode) => {
  const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: { on: { PING: {} } } } }).start()
  const root = createRoot(document.createElement('div'))
  let effects = 0
  const events: string[] = []
  function report() {
    effects++
    // Bound the test: without this guard a whole-snapshot effect writing new
    // event metadata can continually trigger itself. Selection filters PING.
    if (events.length < 3) {
      events.push('PING')
      service.send('PING')
    }
  }
  function Snapshot() {
    const [state] = useActor(service)
    useEffect(report, [state])
    return createElement('output', null, state.context.count)
  }
  function Selected() {
    const count = useSelector(service, state => state.context.count)
    useEffect(report, [count])
    return createElement('output', null, count)
  }
  try {
    await act(async () => root.render(createElement(mode === 'snapshot' ? Snapshot : Selected)))
    expect(events).toHaveLength(mode === 'snapshot' ? 3 : 1)
    expect(effects).toBe(mode === 'snapshot' ? 4 : 1)
    const beforeCount = effects
    await act(async () => service.setContext({ count: 1 }))
    expect(effects).toBe(beforeCount + 1)
    expect(service.getState().context.count).toBe(1)
  }
  finally {
    await act(async () => root.unmount())
    service.stop()
  }
})
