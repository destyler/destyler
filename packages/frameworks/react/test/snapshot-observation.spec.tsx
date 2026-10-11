import { createMachine } from '@destyler/xstate'
import { act, createElement, startTransition, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('react snapshot observation lifecycle', () => {
  it('preserves snapshot identity across renders without store mutations', async () => {
    const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
    const root = createRoot(document.createElement('div'))
    const snapshots: object[] = []
    function View({ label }: { label: string }) {
      const [state] = useActor(service)
      snapshots.push(state)
      return createElement('span', null, `${label}:${state.context.count}`)
    }
    try {
      await act(async () => root.render(createElement(View, { label: 'first' })))
      const initial = snapshots.at(-1)
      await act(async () => root.render(createElement(View, { label: 'second' })))
      expect(snapshots.at(-1)).toBe(initial)
      const beforeNoChange = snapshots.length
      await act(async () => service.setContext({ count: 0 }))
      expect(snapshots).toHaveLength(beforeNoChange)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('reads new fields from a replacement actor and follows only that actor', async () => {
    function createActor(count: number) {
      return createMachine({ initial: 'idle', context: { count }, states: { idle: {} } }).start()
    }
    const first = createActor(0)
    const second = createActor(7)
    const container = document.createElement('div')
    const root = createRoot(container)
    let renders = 0
    function View({ actor, showCount }: { actor: ReturnType<typeof createActor>, showCount: boolean }) {
      const [state] = useActor(actor)
      renders++
      return createElement('span', null, showCount ? `${state.value}:${state.context.count}` : state.value)
    }
    try {
      await act(async () => root.render(createElement(View, { actor: first, showCount: false })))
      await act(async () => root.render(createElement(View, { actor: second, showCount: true })))
      expect(container.textContent).toBe('idle:7')
      const beforeOldActorMutation = renders
      await act(async () => first.setContext({ count: 100 }))
      expect(renders).toBe(beforeOldActorMutation)
      expect(container.textContent).toBe('idle:7')
      await act(async () => second.setContext({ count: 8 }))
      expect(container.textContent).toBe('idle:8')
      expect(first.status).toBe('Running')
      expect(second.status).toBe('Running')
    }
    finally {
      await act(async () => root.unmount())
      first.stop()
      second.stop()
    }
  })

  it('hydrates matching markup and reveals the latest initially unobserved field', async () => {
    const service = createMachine({ initial: 'idle', context: { count: 5 }, states: { idle: {} } }).start()
    const container = document.createElement('div')
    const onRecoverableError = vi.fn()
    function View({ showCount }: { showCount: boolean }) {
      const [state] = useActor(service)
      return createElement('span', null, showCount ? `${state.value}:${state.context.count}` : state.value)
    }
    container.innerHTML = renderToString(createElement(View, { showCount: false }))
    const serverNode = container.firstChild
    const root = hydrateRoot(container, createElement(View, { showCount: false }), { onRecoverableError })
    try {
      await act(async () => {
        await Promise.resolve()
      })
      expect(container.firstChild).toBe(serverNode)
      expect(container.textContent).toBe('idle')
      await act(async () => service.setContext({ count: 6 }))
      expect(container.textContent).toBe('idle')
      await act(async () => root.render(createElement(View, { showCount: true })))
      expect(container.textContent).toBe('idle:6')
      expect(onRecoverableError).not.toHaveBeenCalled()
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it.each([false, true])('reads newly observed fields while filtering unobserved notifications (sync: %s)', async (sync) => {
    const service = createMachine({ initial: 'idle', context: { count: 0, other: 0 }, states: { idle: {} } }).start()
    const container = document.createElement('div')
    const root = createRoot(container)
    let renders = 0
    function View({ showCount }: { showCount: boolean }) {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('span', null, showCount ? `${state.value}:${state.context.count}` : state.value)
    }
    try {
      await act(async () => root.render(createElement(View, { showCount: false })))
      expect(container.textContent).toBe('idle')
      const beforeHiddenChange = renders
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBe(beforeHiddenChange)
      expect(service.contextSnapshot.count).toBe(1)
      await act(async () => root.render(createElement(View, { showCount: true })))
      expect.soft(container.textContent).toBe('idle:1')

      const beforeOtherChange = renders
      await act(async () => service.setContext({ other: 1 }))
      expect.soft(renders).toBe(beforeOtherChange)
      await act(async () => service.setContext({ count: 2 }))
      expect(container.textContent).toBe('idle:2')

      await act(async () => root.render(createElement(View, { showCount: false })))
      const beforeUnobserving = renders
      await act(async () => service.setContext({ count: 3 }))
      expect(renders).toBe(beforeUnobserving)
      await act(async () => root.render(createElement(View, { showCount: true })))
      expect(container.textContent).toBe('idle:3')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it.each(['commit', 'discard'] as const)('uses current data after suspended observation is followed by %s', async (outcome) => {
    const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
    const container = document.createElement('div')
    const root = createRoot(container)
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    let ready = false
    let attempts = 0
    function View({ showCount }: { showCount: boolean }) {
      const state = useSnapshot(service)
      const text = showCount ? `${state.value}:${state.context.count}` : state.value
      if (showCount && !ready) {
        attempts++
        throw pending
      }
      return createElement('span', null, text)
    }
    function render(showCount: boolean) {
      return createElement(Suspense, { fallback: 'loading' }, createElement(View, { showCount }))
    }
    try {
      await act(async () => root.render(render(false)))
      await act(async () => startTransition(() => root.render(render(true))))
      expect(attempts).toBeGreaterThan(0)
      expect(container.textContent).toBe('idle')
      const attemptsBeforeMutation = attempts
      await act(async () => service.setContext({ count: 7 }))
      expect(attempts).toBe(attemptsBeforeMutation)
      expect(container.textContent).toBe('idle')
      if (outcome === 'discard')
        await act(async () => root.render(render(false)))
      ready = true
      await act(async () => resolve())
      if (outcome === 'discard') {
        expect(container.textContent).toBe('idle')
        await act(async () => root.render(render(true)))
      }
      expect(container.textContent).toBe('idle:7')
    }
    finally {
      await act(async () => root.unmount())
      resolve()
      service.stop()
    }
  })
})
