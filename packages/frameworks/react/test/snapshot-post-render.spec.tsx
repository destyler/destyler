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
  it('updates passive effects for unread fields as well as effect-read fields', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const effects: number[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      // Reads do not establish or narrow the full-snapshot subscription.
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
      expect(renders).toBe(initialRenders + 1)
      expect(effects).toEqual([0, 0])
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

  it('keeps explicitly retained snapshots historical while refreshing the committed handler', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: number[] = []
    let renders = 0
    let retained: (() => void) | undefined
    function View({ reveal = false }: { reveal?: boolean }) {
      const state = useSnapshot(service, { sync })
      renders++
      const handler = () => reads.push(state.context.count)
      retained ??= handler
      return createElement('button', { onClick: handler }, reveal ? state.context.count : state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      const initialRenders = renders
      // No count read occurred yet; full-snapshot membership is already active.
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBe(initialRenders + 1)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([1])
      retained!()
      expect(reads).toEqual([1, 0])
      expect(service.contextSnapshot.count).toBe(1)
      expect(renders).toBe(initialRenders + 1)
      // Reading the old snapshot does not alter future notifications.
      await act(async () => service.setContext({ count: 2 }))
      expect(renders).toBeGreaterThan(initialRenders)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([1, 0, 2])
      await act(async () => root.render(createElement(View, { reveal: true })))
      expect(container.textContent).toBe('2')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('tracks a new event `in` observation on each committed snapshot', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: boolean[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', {
        onClick: () => {
          reads.push('extra' in state.context)
        },
      }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false])
      const rendersAfterRead = renders
      await act(async () => service.setContext({ extra: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterRead)
      // The new handler captures the new immutable snapshot.
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false, true])
      const rendersAfterAdd = renders
      await act(async () => {
        delete service.state.context.extra
      })
      expect(renders).toBeGreaterThan(rendersAfterAdd)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false, true, false])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('tracks a new event Object.keys observation on each committed snapshot', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const reads: string[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', {
        onClick: () => {
          reads.push(Object.keys(state.context).join(','))
        },
      }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual(['count,other'])
      const rendersAfterRead = renders
      await act(async () => service.setContext({ extra: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterRead)
      await act(async () => container.querySelector('button')!.click())
      expect(reads.at(-1)).toContain('extra')
      const rendersAfterExtra = renders
      await act(async () => service.setContext({ more: 2 }))
      expect(renders).toBeGreaterThan(rendersAfterExtra)
      await act(async () => container.querySelector('button')!.click())
      expect(reads.at(-1)).toContain('more')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('tracks a symbol key observed with in on each committed snapshot', async () => {
    const service = createService()
    const flag = Symbol('flag')
    const container = document.createElement('div')
    const root = createRoot(container)
    const context = service.state.context as Record<PropertyKey, unknown>
    const reads: boolean[] = []
    let renders = 0
    function View() {
      const state = useSnapshot(service, { sync })
      renders++
      return createElement('button', {
        onClick: () => {
          reads.push(flag in (state.context as object))
        },
      }, state.value)
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false])
      const rendersAfterRead = renders
      await act(async () => {
        context[flag] = 1
      })
      expect(renders).toBeGreaterThan(rendersAfterRead)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false, true])
      const rendersAfterSet = renders
      await act(async () => {
        delete context[flag]
      })
      expect(renders).toBeGreaterThan(rendersAfterSet)
      await act(async () => container.querySelector('button')!.click())
      expect(reads).toEqual([false, true, false])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })
})
