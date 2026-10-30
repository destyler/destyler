import type { ReactTestRenderer } from 'react-test-renderer'
import { createMachine } from '@destyler/xstate'
import { act, createElement, startTransition, Suspense } from 'react'
import { create as createRenderer } from 'react-test-renderer'
import { describe, expect, it } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('snapshot observation without a DOM document', () => {
  it('observes an event-only read after suspense on a non-DOM renderer', async () => {
    expect(typeof document).toBe('undefined')
    const service = createMachine({ initial: 'idle', context: { count: 0, other: 0 }, states: { idle: {} } }).start()
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    let ready = false
    let attempts = 0
    let renders = 0
    const reads: number[] = []
    let renderer!: ReactTestRenderer
    function View({ suspend }: { suspend: boolean }) {
      const state = useSnapshot(service, { sync: true })
      renders++
      if (suspend && !ready) {
        attempts++
        throw pending
      }
      return createElement('button', {
        onClick: () => {
          reads.push(state.context.count)
        },
      }, state.value)
    }
    const render = (suspend: boolean) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend }))
    try {
      await act(async () => {
        // React 18's test renderer is a legacy root unless this is set, and a
        // legacy update replaces the committed button with the Suspense fallback.
        renderer = createRenderer(render(false), { unstable_isConcurrent: true })
      })
      expect(renderer.toJSON()).toMatchObject({ type: 'button', children: ['idle'] })
      await act(async () => startTransition(() => {
        renderer.update(render(true))
      }))
      expect(attempts).toBeGreaterThan(0)
      expect(renderer.toJSON()).toMatchObject({ type: 'button', children: ['idle'] })
      await act(async () => {
        renderer.root.findByType('button').props.onClick()
      })
      expect(reads).toEqual([0])
      const rendersAfterRead = renders
      await act(async () => service.setContext({ other: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterRead)
      const rendersAfterOther = renders
      await act(async () => service.setContext({ count: 1 }))
      expect(renders).toBeGreaterThan(rendersAfterOther)
      await act(async () => {
        renderer.root.findByType('button').props.onClick()
      })
      expect(reads).toEqual([0, 1])
    }
    finally {
      ready = true
      await act(async () => resolve())
      await act(async () => renderer.unmount())
      service.stop()
    }
  })

  it('observes the public useActor path without a DOM document', async () => {
    expect(typeof document).toBe('undefined')
    const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
    const reads: number[] = []
    let renderer!: ReactTestRenderer
    function View() {
      const [state] = useActor(service)
      return createElement('button', {
        onClick: () => {
          reads.push(state.context.count)
        },
      }, state.value)
    }
    try {
      await act(async () => {
        renderer = createRenderer(createElement(View))
      })
      await act(async () => {
        renderer.root.findByType('button').props.onClick()
      })
      expect(reads).toEqual([0])
      await act(async () => service.setContext({ count: 4 }))
      await act(async () => {
        renderer.root.findByType('button').props.onClick()
      })
      expect(reads).toEqual([0, 4])
    }
    finally {
      await act(async () => renderer.unmount())
      service.stop()
    }
  })
})
