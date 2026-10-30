import { createMachine } from '@destyler/xstate'
import { act, createElement, memo, startTransition, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function createService() {
  return createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
}

type State = ReturnType<ReturnType<typeof createService>['getState']>

function usePublicState(service: ReturnType<typeof createService>) {
  return useActor(service)[0]
}

function useSynchronousState(service: ReturnType<typeof createService>) {
  return useSnapshot(service, { sync: true })
}

describe.each([false, true])('snapshot render ownership (sync: %s)', (sync) => {
  const useObservedState = sync ? useSynchronousState : usePublicState
  it.each([false, true])('observes a committed child rerender while its parent is suspended: %s', async (suspend) => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const pending = new Promise<void>(() => {})
    let attempts = 0
    let commits = 0
    function Child({ state }: { state: State }) {
      const [show, setShow] = useState(false)
      return createElement('button', { onClick: () => setShow(true) }, show ? state.context.count : state.value)
    }
    function Owner({ suspend }: { suspend: boolean }) {
      const state = useObservedState(service)
      useLayoutEffect(() => {
        commits++
      })
      if (suspend) {
        attempts++
        throw pending
      }
      return createElement(Child, { state })
    }
    const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(Owner, { suspend }))
    try {
      await act(async () => root.render(render(false)))
      if (suspend) {
        await act(async () => startTransition(() => root.render(render(true))))
        expect(attempts).toBeGreaterThan(0)
      }
      expect(container.textContent).toBe('idle')
      const beforeChildUpdate = commits
      await act(async () => container.querySelector('button')!.click())
      // The hook did not render again: the child read its committed proxy.
      expect(commits).toBe(beforeChildUpdate)
      expect(container.textContent).toBe('0')
      await act(async () => service.setContext({ count: 1 }))
      expect(container.textContent).toBe('1')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it.each(['layout', 'passive'] as const)('drops a child %s-effect observation after a newer commit', async (phase) => {
    const service = createService()
    const root = createRoot(document.createElement('div'))
    const values: number[] = []
    let renders = 0
    const useReadEffect = phase === 'layout' ? useLayoutEffect : useEffect
    function Child({ state, read }: { state: State, read: boolean }) {
      useReadEffect(() => {
        if (read)
          values.push(state.context.count)
      })
      return null
    }
    function Owner({ read }: { read: boolean }) {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('div', null, state.value, createElement(Child, { state, read }))
    }
    try {
      await act(async () => root.render(createElement(Owner, { read: true })))
      expect(values).toEqual([0])
      await act(async () => service.setContext({ count: 1 }))
      expect(values.at(-1)).toBe(1)
      await act(async () => root.render(createElement(Owner, { read: false })))
      const beforeUnobservedChange = renders
      await act(async () => service.setContext({ count: 2 }))
      expect(renders).toBe(beforeUnobservedChange)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('does not retain event-only observations for the lifetime of the hook', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[] = []
    let renders = 0
    function View({ label }: { label: string }) {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', { onClick: () => reads.push(state.context.count) }, label + state.value)
    }
    try {
      await act(async () => root.render(createElement(View, { label: 'first' })))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      await act(async () => root.render(createElement(View, { label: 'second' })))
      const beforeUnobservedChange = renders
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBe(beforeUnobservedChange)
      // Captured snapshots are immutable, not a live event-time state getter.
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 0])
      expect(service.getState().context.count).toBe(1)
      await act(async () => service.setContext({ count: 2 }))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 0, 2])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('reads current event-time state without creating an event-only subscription', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', {
        onClick: () => reads.push(service.getState().context.count),
      }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      const initialRenders = renders
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBe(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([1])
      await act(async () => service.setContext({ count: 2 }))
      expect(renders).toBe(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([1, 2])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it.each([false, true])('observes aliased object paths after a committed reference switch: %s', async (split) => {
    const service = createMachine({
      initial: 'idle',
      context: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 0 }, tick: 0 },
      states: { idle: {} },
    }).start()
    service.state.context.b = service.state.context.a
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[][] = []
    function View() {
      const state = useSnapshot(service, { sync })
      return createElement('button', {
        onClick: () => reads.push([state.context.a.x, state.context.b.x, state.context.c.y]),
      }, state.context.tick)
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([[0, 0, 0]])
      await act(async () => {
        if (split)
          service.state.context.b = service.state.context.c
        service.state.context.tick++
      })
      expect(container.textContent).toBe('1')
      // Observe the new commit; do not silently require lifetime subscriptions.
      await act(async () => container.querySelector('button')!.click())
      await act(async () => {
        service.state.context.b.x = 1
      })
      await act(async () => container.querySelector('button')!.click())
      expect(reads.at(-1)).toEqual([split ? 0 : 1, 1, 0])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })
})

it('keeps field-based memo and effect dependencies stable across unchanged renders', async () => {
  const service = createService()
  const root = createRoot(document.createElement('div'))
  let ownerRenders = 0
  let fieldRenders = 0
  let snapshotRenders = 0
  let fieldEffects = 0
  const Field = memo(({ count }: { count: number }) => {
    fieldRenders++
    return createElement('span', null, count)
  })
  const Snapshot = memo(({ state }: { state: State }) => {
    snapshotRenders++
    return createElement('span', null, state.context.count)
  })
  function Owner({ label }: { label: string }) {
    const [state] = useActor(service)
    ownerRenders++
    const count = state.context.count
    useEffect(() => {
      fieldEffects++
    }, [count])
    return createElement('div', null, label, createElement(Field, { count }), createElement(Snapshot, { state }))
  }
  try {
    const raw = service.getState()
    for (let index = 0; index < 11; index++)
      await act(async () => root.render(createElement(Owner, { label: String(index) })))
    expect(ownerRenders).toBe(11)
    expect(fieldRenders).toBe(1)
    expect(fieldEffects).toBe(1)
    // Document the intentional memo cost of passing the whole render proxy.
    expect(snapshotRenders).toBe(11)
    expect(service.getState()).toBe(raw)
    await act(async () => service.setContext({ count: 0 }))
    expect(ownerRenders).toBe(11)
    await act(async () => service.setContext({ count: 1 }))
    expect(ownerRenders).toBe(12)
    expect(fieldRenders).toBe(2)
    expect(fieldEffects).toBe(2)
  }
  finally {
    await act(async () => root.unmount())
    service.stop()
  }
})
