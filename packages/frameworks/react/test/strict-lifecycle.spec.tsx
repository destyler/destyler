import type { subscribe } from '@destyler/store'
import { createMachine } from '@destyler/xstate'
import { act, createElement, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useMachine } from '../src/hooks/use-machine'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Keep the observation handle local: browser module interception must still
// route both StrictMode subscriptions through this exact spy.
const { subscribeSpy } = vi.hoisted(() => ({
  subscribeSpy: vi.fn<typeof subscribe>(),
}))

vi.mock('@destyler/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@destyler/store')>()
  return {
    ...actual,
    subscribe: subscribeSpy.mockImplementation((...args: Parameters<typeof actual.subscribe>) => {
      const notify = vi.fn(args[1])
      const unsubscribe = vi.fn(actual.subscribe(args[0], notify, args[2]))
      return Object.assign(unsubscribe, { notify })
    }),
  }
})

describe('react StrictMode resource lifecycle', () => {
  it('does not acquire activities or start machines from an abandoned initial suspension', async () => {
    const activity = vi.fn(() => vi.fn())
    const instances: ReturnType<typeof createMachine>[] = []
    const starts: ReturnType<typeof vi.spyOn>[] = []
    const stops: ReturnType<typeof vi.spyOn>[] = []
    const factory = () => {
      const service = createMachine({
        initial: 'idle',
        context: {},
        activities: 'listen',
        states: { idle: {} },
      }, { activities: { listen: activity } })
      instances.push(service)
      starts.push(vi.spyOn(service, 'start'))
      stops.push(vi.spyOn(service, 'stop'))
      return service
    }
    let resolve!: () => void
    const pending = new Promise<void>((done) => {
      resolve = done
    })
    const container = document.createElement('div')
    const root = createRoot(container)
    function View(): never {
      useMachine(factory)
      throw pending
    }
    try {
      await act(async () => root.render(createElement(StrictMode, null, createElement(Suspense, { fallback: 'loading' }, createElement(View)))))
      expect(container.textContent).toBe('loading')
      expect(instances.length).toBeGreaterThan(0)
      expect(activity).not.toHaveBeenCalled()
      await act(async () => root.render(createElement('span', null, 'cancelled')))
      await act(async () => resolve())
      expect(container.textContent).toBe('cancelled')
      expect(instances.every(instance => instance.status === 'Not Started')).toBe(true)
      starts.forEach(start => expect(start).not.toHaveBeenCalled())
      stops.forEach(stop => expect(stop).not.toHaveBeenCalled())
      expect(activity).not.toHaveBeenCalled()
    }
    finally {
      await act(async () => root.unmount())
      resolve()
    }
  })

  it('releases every replayed activity and restarts with one live lease on remount', async () => {
    let active = 0
    let peak = 0
    let acquired = 0
    let released = 0
    const onEvent = vi.fn()
    const service = createMachine({
      initial: 'idle',
      context: { count: 0 },
      activities: 'listen',
      on: { INC: { actions: 'increment' } },
      states: { idle: {} },
    }, {
      actions: { increment: ctx => ctx.count++ },
      activities: {
        listen: () => {
          acquired++
          active++
          peak = Math.max(peak, active)
          window.addEventListener('destyler-react-strict-probe', onEvent)
          return () => {
            released++
            active--
            window.removeEventListener('destyler-react-strict-probe', onEvent)
          }
        },
      },
    })
    const factory = vi.fn(() => service)
    const container = document.createElement('div')
    const root = createRoot(container)
    function View() {
      const [state] = useMachine(factory)
      return createElement('span', null, state.context.count)
    }
    try {
      await act(async () => root.render(createElement(StrictMode, null, createElement(View))))
      expect(acquired).toBe(2)
      expect(released).toBe(1)
      expect(active).toBe(1)
      expect(peak).toBe(1)
      window.dispatchEvent(new Event('destyler-react-strict-probe'))
      expect(onEvent).toHaveBeenCalledTimes(1)
      await act(async () => service.send('INC'))
      expect(container.textContent).toBe('1')

      await act(async () => root.render(null))
      expect(active).toBe(0)
      expect(released).toBe(acquired)
      expect(service.status).toBe('Stopped')
      window.dispatchEvent(new Event('destyler-react-strict-probe'))
      expect(onEvent).toHaveBeenCalledTimes(1)

      await act(async () => root.render(createElement(StrictMode, null, createElement(View))))
      expect(service.status).toBe('Running')
      expect(active).toBe(1)
      expect(peak).toBe(1)
      expect(acquired).toBe(4)
      expect(released).toBe(3)
      expect(container.textContent).toBe('1')
      window.dispatchEvent(new Event('destyler-react-strict-probe'))
      expect(onEvent).toHaveBeenCalledTimes(2)
    }
    finally {
      await act(async () => root.unmount())
    }
    expect(active).toBe(0)
    expect(released).toBe(acquired)
  })

  it('detaches queued actor notifications on unmount without stopping the external actor', async () => {
    const service = createMachine({
      initial: 'idle',
      context: { count: 0 },
      on: { INC: { actions: 'increment' } },
      states: { idle: {} },
    }, { actions: { increment: ctx => ctx.count++ } }).start()
    const start = vi.spyOn(service, 'start')
    const stop = vi.spyOn(service, 'stop')
    const container = document.createElement('div')
    const root = createRoot(container)
    const subscriptionsBeforeMount = subscribeSpy.mock.calls.length
    let renders = 0
    function View() {
      const [state] = useActor(service)
      renders++
      return createElement('span', null, state.context.count)
    }
    try {
      await act(async () => root.render(createElement(StrictMode, null, createElement(View))))
      const relevant = subscribeSpy.mock.calls.flatMap((args, index) => index >= subscriptionsBeforeMount && args[0] === service.state
        ? [subscribeSpy.mock.results[index].value as ReturnType<typeof subscribe> & { notify: ReturnType<typeof vi.fn> }]
        : [])
      expect(relevant).toHaveLength(2)
      expect(relevant[0]).toHaveBeenCalledTimes(1)
      expect(relevant[1]).not.toHaveBeenCalled()
      expect(container.textContent).toBe('0')

      // Prove the active lease forwards real notifications before checking
      // cancellation; a detached or inert observation hook must not pass.
      await act(async () => service.send('INC'))
      expect(relevant[0].notify).not.toHaveBeenCalled()
      expect(relevant[1].notify).toHaveBeenCalledTimes(1)
      expect(container.textContent).toBe('1')
      await act(async () => service.setContext({ count: 0 }))
      expect(relevant[1].notify).toHaveBeenCalledTimes(2)
      expect(container.textContent).toBe('0')
      relevant.forEach(unsubscribe => unsubscribe.notify.mockClear())
      const rendersBeforeUnmount = renders

      // The mutation enqueues a microtask; synchronous unmount must cancel it.
      act(() => {
        service.send('INC')
        root.unmount()
      })
      await act(async () => {
        await Promise.resolve()
      })
      expect(relevant[1]).toHaveBeenCalledTimes(1)
      relevant.forEach(unsubscribe => expect(unsubscribe.notify).not.toHaveBeenCalled())
      expect(renders).toBe(rendersBeforeUnmount)
      expect(container.textContent).toBe('')
      expect(start).not.toHaveBeenCalled()
      expect(stop).not.toHaveBeenCalled()
      expect(service.status).toBe('Running')
      service.send('INC')
      expect(service.contextSnapshot.count).toBe(2)
    }
    finally {
      act(() => root.unmount())
      service.stop()
    }
  })
})
