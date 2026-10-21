import type { AnyMachine } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { act, createElement, startTransition, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { useActor } from '../index'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Investigation for #352: this expectation is deliberately not an established
// public event-read contract. Keep this draft reproduction out of main until
// the intended semantics and an implementation tradeoff have been decided.
function usePublicActorSnapshot(service: AnyMachine) {
  const [state] = useActor(service)
  return state
}

function useSynchronousSnapshot(service: AnyMachine) {
  return useSnapshot(service, { sync: true })
}

it.each([
  ['public useActor (batched)', usePublicActorSnapshot],
  ['internal useSnapshot (sync)', useSynchronousSnapshot],
] as const)('investigates committed event reads after a suspended render: %s', async (_name, useObservedState) => {
  const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
  const container = document.createElement('div')
  const root = createRoot(container)
  let resolve!: () => void
  const pending = new Promise<void>((done) => {
    resolve = done
  })
  let ready = false
  let attempts = 0
  const reads: number[] = []
  function View({ suspend }: { suspend: boolean }) {
    const state = useObservedState(service)
    if (suspend && !ready) {
      attempts++
      throw pending
    }
    return createElement('button', { onClick: () => reads.push(state.context.count) }, state.value)
  }
  const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend }))
  try {
    await act(async () => root.render(render(false)))
    // R0 commits without observing count; R1 reuses R0's raw snapshot and
    // suspends. R0's button remains mounted and interactive.
    await act(async () => startTransition(() => root.render(render(true))))
    expect(attempts).toBeGreaterThan(0)
    expect(container.textContent).toBe('idle')
    await act(async () => container.querySelector('button')!.click())
    expect(reads).toEqual([0])
    // Unlike reading a captured snapshot after a filtered mutation, the
    // committed handler observes count BEFORE this mutation.
    await act(async () => service.setContext({ count: 1 }))
    expect(service.contextSnapshot.count).toBe(1)
    await act(async () => container.querySelector('button')!.click())
    expect(reads).toEqual([0, 1])
  }
  finally {
    await act(async () => root.unmount())
    ready = true
    await act(async () => resolve())
    service.stop()
  }
})
