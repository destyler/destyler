import type { AnyEventObject, EventObject, Machine, StateSchema } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { act, createElement, startTransition, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

type Service = Machine<Record<string, any>, StateSchema, EventObject | AnyEventObject>

function usePublicActorSnapshot(service: Service) {
  const [state] = useActor(service as Parameters<typeof useActor>[0])
  return state
}

function useSynchronousSnapshot(service: Service) {
  return useSnapshot(service as Parameters<typeof useSnapshot>[0], { sync: true })
}

describe('committed event reads after a suspended render', () => {
  it.each([
    ['public useActor (batched)', usePublicActorSnapshot, false],
    ['internal useSnapshot (sync)', useSynchronousSnapshot, false],
    ['public useActor (batched), render-read control', usePublicActorSnapshot, true],
    ['internal useSnapshot (sync), render-read control', useSynchronousSnapshot, true],
  ] as const)('observes a field first read by a committed handler: %s', async (_name, useObservedState, observeInRender) => {
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
      // Positive control: a render read must keep notifying while an unresolved
      // transition is pending. The event-only cases leave this unread.
      if (observeInRender)
        void state.context.count
      if (suspend && !ready) {
        attempts++
        throw pending
      }
      return createElement('button', { onClick: () => reads.push(state.context.count) }, state.value)
    }
    const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend }))
    try {
      await act(async () => root.render(render(false)))
      // R0 commits without reading count. R1 reuses that snapshot and suspends,
      // leaving R0's button mounted.
      await act(async () => startTransition(() => root.render(render(true))))
      expect(attempts).toBeGreaterThan(0)
      expect(container.textContent).toBe('idle')
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      // The handler observed count before this mutation, so the update must commit.
      await act(async () => service.setContext({ count: 1 }))
      expect(service.contextSnapshot.count).toBe(1)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 1])
      if (!observeInRender) {
        await act(async () => service.setContext({ count: 2 }))
        await act(async () => container.querySelector('button')!.click())
        expect(reads).toEqual([0, 1, 2])
      }
    }
    finally {
      await act(async () => root.unmount())
      ready = true
      await act(async () => resolve())
      service.stop()
    }
  })

  it.each([
    ['public useActor (batched)', usePublicActorSnapshot],
    ['internal useSnapshot (sync)', useSynchronousSnapshot],
  ] as const)('does not notify for a field that was never read (%s)', async (_name, useObservedState) => {
    const service = createMachine({ initial: 'idle', context: { count: 0, other: 0 }, states: { idle: {} } }).start()
    const container = document.createElement('div')
    const root = createRoot(container)
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    let ready = false
    let attempts = 0
    let renders = 0
    const reads: number[] = []
    function View({ suspend }: { suspend: boolean }) {
      const state = useObservedState(service)
      renders++
      if (suspend && !ready) {
        attempts++
        throw pending
      }
      return createElement('button', { onClick: () => reads.push(state.context.count) }, state.value)
    }
    const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend }))
    try {
      await act(async () => root.render(render(false)))
      await act(async () => startTransition(() => root.render(render(true))))
      expect(attempts).toBeGreaterThan(0)
      expect(container.textContent).toBe('idle')
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      const rendersAfterRead = renders
      const attemptsAfterRead = attempts
      await act(async () => service.setContext({ other: 1 }))
      expect(service.contextSnapshot.other).toBe(1)
      expect(renders).toBe(rendersAfterRead)
      expect(attempts).toBe(attemptsAfterRead)

      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterRead)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 1])

      // The count notification commits a new snapshot. `other` was still never
      // read, including by the suspended attempt, so it must not notify again.
      const rendersAfterCount = renders
      const attemptsAfterCount = attempts
      await act(async () => service.setContext({ other: 2 }))
      expect(service.contextSnapshot.other).toBe(2)
      expect(renders).toBe(rendersAfterCount)
      expect(attempts).toBe(attemptsAfterCount)
    }
    finally {
      await act(async () => root.unmount())
      ready = true
      await act(async () => resolve())
      service.stop()
    }
  })
})
