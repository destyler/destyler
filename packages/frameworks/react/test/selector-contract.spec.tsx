import type { ReactNode } from 'react'
import { createMachine } from '@destyler/xstate'
import { act, Component, createElement, startTransition, StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSelector } from '../src/hooks/use-selector'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function createService(count = 0) {
  return createMachine({
    initial: 'idle',
    context: { count, other: 0, items: [{ id: 1 }] },
    states: { idle: { on: { PING: {} } } },
  }).start()
}

type Service = ReturnType<typeof createService>
type State = ReturnType<Service['getState']>
interface Selected { value: number }
const selectCount = (state: State): Selected => ({ value: state.context.count })
const selectOther = (state: State): Selected => ({ value: state.context.other })
const equalValue = (previous: Selected, next: Selected) => previous.value === next.value

class ErrorBoundary extends Component<{ children?: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    return this.state.error ? createElement('span', null, this.state.error.message) : this.props.children
  }
}

describe('react selector contract', () => {
  it('caches allocating selections and handles changed inline selectors and equality', async () => {
    const service = createService()
    const root = createRoot(document.createElement('div'))
    const committed: Selected[] = []
    function View({ selector = selectCount, compare = equalValue }: {
      selector?: (state: State) => Selected
      compare?: (previous: Selected, next: Selected) => boolean
    }) {
      const value = useSelector(service, selector, compare)
      useEffect(() => {
        committed.push(value)
      })
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      const first = committed.at(-1)
      await act(async () => service.setContext({ other: 1 }))
      expect(committed).toHaveLength(1)
      await act(async () => root.render(createElement(View, { selector: state => ({ value: state.context.count }) })))
      expect(committed.at(-1)).toBe(first)
      const offset = (state: State) => ({ value: state.context.count + 10 })
      await act(async () => root.render(createElement(View, { selector: offset })))
      expect(committed.at(-1)).toEqual({ value: 10 })
      const previous = committed.at(-1)
      await act(async () => root.render(createElement(View, { selector: offset, compare: () => false })))
      expect(committed.at(-1)).not.toBe(previous)
      await act(async () => service.setContext({ count: 1 }))
      expect(committed.at(-1)).toEqual({ value: 11 })
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('preserves direct object and array references until their branch changes', async () => {
    const service = createService()
    const root = createRoot(document.createElement('div'))
    const arrays: State['context']['items'][] = []
    const objects: State['context']['items'][number][] = []
    function View() {
      const items = useSelector(service, state => state.context.items)
      const item = useSelector(service, state => state.context.items[0])
      arrays.push(items)
      objects.push(item)
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      const firstArray = arrays[0]
      const firstObject = objects[0]
      await act(async () => service.setContext({ other: 1 }))
      expect(arrays).toHaveLength(1)
      await act(async () => {
        service.state.context.items[0].id = 2
      })
      expect(arrays.at(-1)).not.toBe(firstArray)
      expect(objects.at(-1)).not.toBe(firstObject)
      expect(firstObject.id).toBe(1)
      expect(objects.at(-1)?.id).toBe(2)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('uses Object.is for NaN and negative zero, and caches undefined selections', async () => {
    const service = createService(Number.NaN)
    const root = createRoot(document.createElement('div'))
    const values: (number | undefined)[] = []
    function View() {
      const value = useSelector(service, state => state.context.other === 2 ? undefined : state.context.count)
      values.push(value)
      return null
    }
    try {
      await act(async () => root.render(createElement(View)))
      await act(async () => service.setContext({ other: 1 }))
      expect(values).toHaveLength(1)
      await act(async () => service.setContext({ count: 0 }))
      expect(values).toHaveLength(2)
      await act(async () => service.setContext({ count: -0 }))
      expect(Object.is(values.at(-1), -0)).toBe(true)
      await act(async () => service.setContext({ other: 2 }))
      expect(values.at(-1)).toBeUndefined()
      const before = values.length
      await act(async () => service.setContext({ count: 5 }))
      expect(values).toHaveLength(before)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it('keeps the committed selection live during a discarded actor and selector switch', async () => {
    const first = createService()
    const second = createService(10)
    const container = document.createElement('div')
    const root = createRoot(container)
    const pending = new Promise<void>(() => {})
    let attempts = 0
    function View({ service, selector, suspend }: {
      service: Service
      selector: (state: State) => Selected
      suspend: boolean
    }) {
      const selected = useSelector(service, selector, equalValue)
      if (suspend) {
        attempts++
        throw pending
      }
      return createElement('span', null, selected.value)
    }
    const render = (service: Service, selector: (state: State) => Selected, suspend = false) =>
      createElement(Suspense, { fallback: 'loading' }, createElement(View, { service, selector, suspend }))
    try {
      await act(async () => root.render(render(first, selectCount)))
      await act(async () => startTransition(() => root.render(render(second, selectOther, true))))
      expect(attempts).toBeGreaterThan(0)
      expect(container.textContent).toBe('0')
      await act(async () => second.setContext({ count: 20, other: 20 }))
      expect(container.textContent).toBe('0')
      await act(async () => first.setContext({ count: 1 }))
      expect(container.textContent).toBe('1')
      await act(async () => root.render(render(first, selectOther)))
      expect(container.textContent).toBe('0')
      await act(async () => first.setContext({ other: 2 }))
      expect(container.textContent).toBe('2')
      await act(async () => root.render(render(second, selectCount)))
      expect(container.textContent).toBe('20')
      await act(async () => first.setContext({ count: 99 }))
      expect(container.textContent).toBe('20')
    }
    finally {
      await act(async () => root.unmount())
      first.stop()
      second.stop()
    }
  })

  it('retries a suspended selector without caching a failed result', async () => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    let ready = false
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    let attempts = 0
    const select = (state: State) => {
      if (!ready) {
        attempts++
        throw pending
      }
      return { value: state.context.count }
    }
    function View() {
      const selected = useSelector(service, select)
      return createElement('span', null, selected.value)
    }
    try {
      await act(async () => root.render(createElement(Suspense, { fallback: 'loading' }, createElement(View))))
      expect(container.textContent).toBe('loading')
      expect(attempts).toBeGreaterThan(0)
      ready = true
      await act(async () => resolve())
      expect(container.textContent).toBe('0')
      await act(async () => service.setContext({ count: 1 }))
      expect(container.textContent).toBe('1')
    }
    finally {
      ready = true
      resolve()
      await act(async () => root.unmount())
      service.stop()
    }
  })

  it.each(['selector', 'equality'] as const)('surfaces %s errors and recovers through an error boundary', async (source) => {
    const service = createService()
    const container = document.createElement('div')
    const root = createRoot(container)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let fail = false
    const select = (state: State) => {
      if (fail && source === 'selector')
        throw new Error('selector failed')
      return { value: state.context.count }
    }
    const compare = (previous: Selected, next: Selected) => {
      if (fail && source === 'equality')
        throw new Error('equality failed')
      return equalValue(previous, next)
    }
    function View() {
      const selected = useSelector(service, select, compare)
      return createElement('span', null, selected.value)
    }
    const render = (key: string) => createElement(ErrorBoundary, { key }, createElement(View))
    try {
      await act(async () => root.render(render('initial')))
      expect(container.textContent).toBe('0')
      fail = true
      await act(async () => service.setContext({ count: 1 }))
      expect(container.textContent).toBe(`${source} failed`)
      fail = false
      await act(async () => root.render(render('recovered')))
      expect(container.textContent).toBe('1')
      await act(async () => service.setContext({ count: 2 }))
      expect(container.textContent).toBe('2')
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
      consoleError.mockRestore()
    }
  })

  it('does not own an external actor lifecycle and cleans up under StrictMode', async () => {
    const service = createService()
    const start = vi.spyOn(service, 'start')
    const stop = vi.spyOn(service, 'stop')
    const root = createRoot(document.createElement('div'))
    let renders = 0
    function View() {
      const value = useSelector(service, state => state.context.count)
      renders++
      return createElement('span', null, value)
    }
    try {
      await act(async () => root.render(createElement(StrictMode, null, createElement(View))))
      await act(async () => service.setContext({ count: 1 }))
      await act(async () => root.unmount())
      const before = renders
      await act(async () => service.setContext({ count: 2 }))
      expect(renders).toBe(before)
      expect(start).not.toHaveBeenCalled()
      expect(stop).not.toHaveBeenCalled()
      expect(service.status).toBe('Running')
    }
    finally {
      start.mockRestore()
      stop.mockRestore()
      service.stop()
    }
  })

  it.each(['snapshot', 'selector'] as const)('measures full-snapshot versus selected shared-actor notification fanout: %s', async (mode) => {
    const service = createService()
    const root = createRoot(document.createElement('div'))
    const renders = Array.from<number>({ length: 20 }).fill(0)
    function SnapshotReader({ index }: { index: number }) {
      const [state] = useActor(service)
      renders[index]++
      return createElement('span', null, index === 0 ? state.context.count : state.context.other)
    }
    function SelectiveReader({ index }: { index: number }) {
      const value = useSelector(service, state => index === 0 ? state.context.count : state.context.other)
      renders[index]++
      return createElement('span', null, value)
    }
    const Reader = mode === 'snapshot' ? SnapshotReader : SelectiveReader
    const total = () => renders.reduce((sum, value) => sum + value, 0)
    try {
      await act(async () => root.render(createElement('div', null, renders.map((_, index) => createElement(Reader, { key: index, index })))))
      const initial = total()
      // Separate act calls model separate event-loop updates, not one batch.
      for (let count = 1; count <= 50; count++)
        await act(async () => service.setContext({ count }))
      expect(total() - initial).toBe(mode === 'snapshot' ? 1000 : 50)
      const beforeEvents = total()
      for (let index = 0; index < 20; index++)
        await act(async () => service.send({ type: 'PING' }))
      expect(total() - beforeEvents).toBe(mode === 'snapshot' ? 400 : 0)
    }
    finally {
      await act(async () => root.unmount())
      service.stop()
    }
  })
})
