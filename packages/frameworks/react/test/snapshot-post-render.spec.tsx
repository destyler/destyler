import { createMachine } from '@destyler/xstate'
import { act, createElement, useEffect, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function createService() {
  return createMachine({ initial: 'idle', context: { count: 0, other: 0 }, states: { idle: {} } }).start()
}

describe.each([false, true])('react post-render snapshot reads (sync: %s)', (sync) => {
  it('tracks a field first read in a passive effect after the hook effect', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const effects: number[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      // useSnapshot publishes its affected map in a layout effect. This later
      // passive read extends that subscription rather than a frozen render-time set.
      useEffect(() => {
        effects.push(state.context.count)
      })
      return createElement('span', null, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      expect(effects).toEqual([0])
      const initialRenders = renders
      await act(async () => service.setContext({ other: 1 }))
      expect(renders).toBe(initialRenders)
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(initialRenders)
      expect(effects.at(-1)).toBe(1)
      expect(container.textContent).toBe('idle')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('tracks a field first read by an event after commit and passive effects', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', { onClick: () => reads.push(state.context.count) }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      const initialRenders = renders
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      expect(renders).toBe(initialRenders)
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 1])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('catches a layout-effect read and mutation before passive effects', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const layoutReads: number[] = []
    function View() {
      const state = useSnapshot(service, { sync })
      useLayoutEffect(() => {
        layoutReads.push(state.context.count)
        if (state.context.count === 0)
          service.setContext({ count: 1 })
      })
      return createElement('button', { onClick: () => layoutReads.push(state.context.count) }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      expect(layoutReads[0]).toBe(0)
      expect(layoutReads.at(-1)).toBe(1)
      await act(async () => container.querySelector('button')!.click())
      expect(layoutReads.at(-1)).toBe(1)
      await act(async () => service.setContext({ count: 2 }))
      expect(layoutReads.at(-1)).toBe(2)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('distinguishes a captured snapshot read after a filtered mutation from a missed update', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[] = []
    let renders = 0
    function View({ reveal = false }: { reveal?: boolean }) {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', { onClick: () => reads.push(state.context.count) }, reveal ? state.context.count : state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      const initialRenders = renders
      // The notification finishes before count is observed. The handler still
      // owns the immutable snapshot from the initial render, not a live store.
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBe(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0])
      expect(service.contextSnapshot.count).toBe(1)
      expect(renders).toBe(initialRenders)
      // A later mutation now sees the event's read in the affected map.
      await act(async () => service.setContext({ count: 2 }))
      expect(renders).toBeGreaterThan(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([0, 2])
      await act(async () => root.render(createElement(View, { reveal: true })))
      expect(container.textContent).toBe('2')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })
})
