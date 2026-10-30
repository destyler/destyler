import { createMachine } from '@destyler/xstate'
import { act, createElement, memo, startTransition, Suspense, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { useActor, useMachine, useSelector } from '../index'
import { useSnapshot } from '../src/hooks/use-snapshot'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

it.each(['useActor', 'useMachine'] as const)('%s subscribes to root identity even without property reads', async (api) => {
  const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } }).start()
  const root = createRoot(document.createElement('div'))
  const snapshots: object[] = []
  function Actor() {
    const [state] = useActor(service)
    useLayoutEffect(() => {
      snapshots.push(state)
    }, [state])
    return null
  }
  function Machine() {
    const [state] = useMachine(service)
    useLayoutEffect(() => {
      snapshots.push(state)
    }, [state])
    return null
  }
  try {
    await act(async () => root.render(createElement(api === 'useActor' ? Actor : Machine)))
    expect(snapshots.at(-1)).toBe(service.getState())
    const before = snapshots.length
    await act(async () => service.setContext({ count: 1 }))
    expect(snapshots).toHaveLength(before + 1)
    expect(snapshots.at(-1)).toBe(service.getState())
    await act(async () => service.setContext({ count: 1 }))
    expect(snapshots).toHaveLength(before + 1)
  }
  finally {
    await act(async () => root.unmount())
    service.stop()
  }
})

describe.each([false, true])('snapshot identity dependencies (sync: %s)', (sync) => {
  describe.each(['root', 'context', 'object', 'array'] as const)('%s identity', (kind) => {
    it.each(['none', 'committed', 'abandoned'] as const)('updates after %s nested reads', async (history) => {
      const service = createMachine({ initial: 'idle', context: { object: { a: 0, b: 0 }, items: [{ a: 0, b: 0 }] }, states: { idle: {} } }).start()
      const root = createRoot(document.createElement('div'))
      const effects: object[] = []
      const pending = new Promise<void>(() => {})
      let attempts = 0
      function View({ read = false, suspend = false }) {
        const state = useSnapshot(service, { sync })
        const dependency = kind === 'root' ? state : kind === 'context' ? state.context : kind === 'object' ? state.context.object : state.context.items
        // React compares the reference without reading any of its properties.
        useLayoutEffect(() => {
          effects.push(dependency)
        }, [dependency])
        if (read) {
          void state.context.object.a
          void state.context.items[0].a
        }
        if (suspend) {
          attempts++
          throw pending
        }
        return createElement('span', null, 'ready')
      }
      const render = (read = false, suspend = false) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { read, suspend }))
      try {
        await act(async () => root.render(render(history === 'committed')))
        if (history === 'committed')
          await act(async () => root.render(render()))
        if (history === 'abandoned') {
          await act(async () => startTransition(() => root.render(render(true, true))))
          expect(attempts).toBeGreaterThan(0)
        }
        expect(effects).toHaveLength(1)
        const before = service.getState()
        await act(async () => {
          if (kind === 'array')
            service.state.context.items[0].b++
          else
            service.state.context.object.b++
        })
        expect(service.getState()).not.toBe(before)
        expect(effects).toHaveLength(2)
        expect(effects[1]).not.toBe(effects[0])
      }
      finally {
        await act(async () => root.unmount())
        service.stop()
      }
    })
  })

  it('updates an opaque memo-child object prop after a nested read was abandoned', async () => {
    const service = createMachine({ initial: 'idle', context: { object: { a: 0, b: 0 } }, states: { idle: {} } }).start()
    const root = createRoot(document.createElement('div'))
    const effects: object[] = []
    const pending = new Promise<void>(() => {})
    let attempts = 0
    const Child = memo(({ value }: { value: object }) => {
      useLayoutEffect(() => {
        effects.push(value)
      }, [value])
      return createElement('span', null, 'ready')
    })
    function View({ suspend = false }) {
      const state = useSnapshot(service, { sync })
      if (suspend) {
        void state.context.object.a
        attempts++
        throw pending
      }
      return createElement(Child, { value: state.context.object })
    }
    const render = (suspend = false) => createElement(Suspense, { fallback: 'loading' }, createElement(View, { suspend }))
    try {
      await act(async () => root.render(render()))
      await act(async () => startTransition(() => root.render(render(true))))
      expect(attempts).toBeGreaterThan(0)
      expect(effects).toHaveLength(1)
      await act(async () => {
        service.state.context.object.b++
      })
      expect(effects).toHaveLength(2)
      expect(effects[1]).not.toBe(effects[0])
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })
})

it('keeps explicit object selection identity independent of nested reads', async () => {
  const service = createMachine({ initial: 'idle', context: { object: { a: 0, b: 0 }, other: 0 }, states: { idle: {} } }).start()
  const root = createRoot(document.createElement('div'))
  const effects: object[] = []
  function View() {
    const object = useSelector(service, state => state.context.object)
    useLayoutEffect(() => {
      effects.push(object)
    }, [object])
    void object.a
    return null
  }
  try {
    await act(async () => root.render(createElement(View)))
    await act(async () => service.setContext({ other: 1 }))
    expect(effects).toHaveLength(1)
    await act(async () => {
      service.state.context.object.b++
    })
    expect(effects).toHaveLength(2)
    expect(effects[1]).not.toBe(effects[0])
  }
  finally {
    await act(async () => root.unmount())
    service.stop()
  }
})
