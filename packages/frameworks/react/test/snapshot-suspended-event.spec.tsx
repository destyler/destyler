import type { AnyEventObject, EventObject, Machine, StateSchema } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { act, createElement, startTransition, StrictMode, Suspense } from 'react'
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

function tree(node: ReturnType<typeof createElement>, strict: boolean) {
  return strict ? createElement(StrictMode, null, node) : node
}

describe('committed event reads after a suspended render', () => {
  it.each([
    ['public useActor (batched)', usePublicActorSnapshot, false, false],
    ['internal useSnapshot (sync)', useSynchronousSnapshot, false, false],
    ['public useActor (batched), render-read control', usePublicActorSnapshot, true, false],
    ['internal useSnapshot (sync), render-read control', useSynchronousSnapshot, true, false],
    ['public useActor (batched), StrictMode', usePublicActorSnapshot, false, true],
    ['internal useSnapshot (sync), StrictMode', useSynchronousSnapshot, false, true],
  ] as const)('observes a field first read by a committed handler: %s', async (_name, useObservedState, observeInRender, strict) => {
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
    const render = (suspend: boolean) => tree(createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend })), strict)
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
    ['public useActor (batched)', usePublicActorSnapshot, false],
    ['internal useSnapshot (sync)', useSynchronousSnapshot, false],
    ['public useActor (batched), StrictMode', usePublicActorSnapshot, true],
    ['internal useSnapshot (sync), StrictMode', useSynchronousSnapshot, true],
  ] as const)('does not notify for a field that was never read (%s)', async (_name, useObservedState, strict) => {
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
    const render = (suspend: boolean) => tree(createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend })), strict)
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

describe('discarded transition reads stay off the retained subscription', () => {
  it.each([
    ['public useActor (batched)', usePublicActorSnapshot],
    ['internal useSnapshot (sync)', useSynchronousSnapshot],
  ] as const)('a yielded child read does not subscribe when the attempt is discarded (%s)', async (_name, useObservedState) => {
    const service = createMachine({
      initial: 'idle',
      context: { count: 0, leaked: 0 },
      states: { idle: {} },
    }).start()
    const container = document.createElement('div')
    const root = createRoot(container)
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    let ready = false
    let attempts = 0
    let renders = 0
    let yieldedBeforeChild = false
    const reads: number[] = []
    function Shell({ suspend }: { suspend: boolean }) {
      const state = useObservedState(service)
      renders++
      if (suspend) {
        const start = performance.now()
        // Outlast the scheduler's frame interval so React yields before Child.
        while (performance.now() - start < 40) {
          // busy
        }
        queueMicrotask(() => {
          yieldedBeforeChild = true
        })
      }
      return createElement(Child, { suspend, state })
    }
    function Child({ suspend, state }: { suspend: boolean, state: { value: string, context: { count: number, leaked: number } } }) {
      if (suspend && !ready) {
        // This read happens in a later slice. It must stay on the attempt map.
        void state.context.leaked
        attempts++
        throw pending
      }
      return createElement('button', { onClick: () => reads.push(state.context.count) }, state.value)
    }
    const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(Shell, { suspend }))
    try {
      await act(async () => root.render(render(false)))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      await act(async () => startTransition(() => root.render(render(true))))
      expect(attempts).toBeGreaterThan(0)
      expect(yieldedBeforeChild).toBe(true)
      expect(container.textContent).toBe('idle')
      const rendersAfterDiscard = renders
      const attemptsAfterDiscard = attempts
      await act(async () => service.setContext({ leaked: 1 }))
      expect(service.contextSnapshot.leaked).toBe(1)
      expect(renders).toBe(rendersAfterDiscard)
      expect(attempts).toBe(attemptsAfterDiscard)
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterDiscard)
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

  it.each([
    ['public useActor (batched)', usePublicActorSnapshot],
    ['internal useSnapshot (sync)', useSynchronousSnapshot],
  ] as const)('a discarded service swap does not wipe the committed retained map (%s)', async (_name, useObservedState) => {
    function actor(label: string, count: number) {
      return createMachine({ initial: 'idle', context: { count, label }, states: { idle: {} } }).start()
    }
    const first = actor('a', 0)
    const second = actor('b', 5)
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
    function View({ service, suspend }: { service: Service, suspend: boolean }) {
      const state = useObservedState(service)
      renders++
      if (suspend && !ready) {
        attempts++
        throw pending
      }
      return createElement('button', { onClick: () => reads.push(state.context.count) }, state.context.label)
    }
    const render = (service: Service, suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { service, suspend }))
    try {
      await act(async () => root.render(render(first, false)))
      expect(container.textContent).toBe('a')
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      await act(async () => startTransition(() => root.render(render(second, true))))
      expect(attempts).toBeGreaterThan(0)
      expect(container.textContent).toBe('a')
      const rendersAfterDiscard = renders
      await act(async () => second.setContext({ count: 9 }))
      expect(renders).toBe(rendersAfterDiscard)
      expect(container.textContent).toBe('a')
      await act(async () => first.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterDiscard)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 1])
      expect(container.textContent).toBe('a')
    }
    finally {
      await act(async () => root.unmount())
      ready = true
      await act(async () => resolve())
      first.stop()
      second.stop()
    }
  })
})
