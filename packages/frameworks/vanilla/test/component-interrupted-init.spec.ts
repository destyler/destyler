import { Component } from '@destyler/vanilla'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'

interface Context { count: number }
interface State { value: 'idle' }
type Service = ReturnType<typeof createMachine<Context, State>>

function createFixture(proxied = false) {
  const hooks: { created?: () => void, subscribe?: () => void, exit?: () => void } = {}
  const listeners = new Set<(value: Partial<Context>) => void>()
  const calls = { get: 0, subscribe: 0, dispose: 0, active: 0, acquired: 0, activityCleanup: 0 }
  const source = Object.freeze({
    get() {
      calls.get++
      return { count: 1 }
    },
    subscribe(listener: (value: Partial<Context>) => void) {
      hooks.subscribe?.()
      listeners.add(listener)
      calls.subscribe++
      return () => {
        listeners.delete(listener)
        calls.dispose++
      }
    },
  })
  const options = Object.freeze({ context: source })
  class Counter extends Component<Context, Context, Context, State> {
    ready = true
    destroying = false
    services: Service[] = []
    renders = 0

    protected initService(context: Context) {
      const service = createMachine<Context, State>({
        initial: 'idle',
        context: { ...context },
        created: () => hooks.created?.(),
        exit: () => hooks.exit?.(),
        activities: [() => {
          calls.acquired++
          calls.active++
          return () => {
            calls.active--
            calls.activityCleanup++
          }
        }],
        states: { idle: {} },
      })
      this.services.push(service)
      return service
    }

    protected initApi() { return this.service.contextSnapshot }
    protected render() {
      this.renders++
      this.rootEl.textContent = String(this.api.count)
    }
  }
  const original = new Counter(document.createElement('div'), { count: 0 }, options)
  const component = proxied ? new Proxy(original, {}) : original
  return {
    component,
    hooks,
    calls,
    source,
    options,
    listeners,
    cleanup() {
      hooks.created = undefined
      hooks.subscribe = undefined
      hooks.exit = undefined
      component.destroy()
      component.services.forEach(service => service.stop())
    },
  }
}

describe('component cleanup after interrupted init', () => {
  it.each([
    ['created', false],
    ['subscribe', false],
    ['created', true],
    ['subscribe', true],
  ] as const)('restores explicit cleanup after %s interrupts init (Proxy: %s)', (boundary, proxied) => {
    const t = createFixture(proxied)
    let interrupted = false
    t.hooks[boundary] = () => {
      if (interrupted)
        return
      interrupted = true
      t.component.destroy()
    }
    try {
      t.component.init()
      expect(interrupted).toBe(true)
      // Explicit cleanup must release anything acquired by interrupted init.
      t.component.destroy()
      t.component.destroy()
      expect(t.component.services[0].status).toBe(MachineStatus.Stopped)
      expect(t.calls.active).toBe(0)
      expect(t.listeners.size).toBe(0)
      expect(t.calls.dispose).toBe(t.calls.subscribe)
      expect(t.calls.activityCleanup).toBe(t.calls.acquired)
      expect(t.component.ready).toBe(true)
      expect(t.component.destroying).toBe(false)
      expect(t.options.context).toBe(t.source)

      t.component.init()
      expect(t.component.services).toHaveLength(2)
      expect(t.component.services[1].status).toBe(MachineStatus.Running)
      expect(t.listeners.size).toBe(1)
      t.component.destroy()
      expect(t.calls.active).toBe(0)
      expect(t.calls.activityCleanup).toBe(t.calls.acquired)
      expect(t.calls.dispose).toBe(t.calls.subscribe)
    }
    finally { t.cleanup() }
  })

  it('keeps repeated destroy dormant before the first init', () => {
    const t = createFixture()
    try {
      t.component.destroy()
      t.component.destroy()
      expect(t.component.state).toBeUndefined()
      expect(t.component.services).toHaveLength(0)
      expect(t.component.renders).toBe(0)
      expect(t.calls).toEqual({ get: 0, subscribe: 0, dispose: 0, active: 0, acquired: 0, activityCleanup: 0 })
      expect(t.options.context).toBe(t.source)
      t.component.init()
      expect(t.component.services[0].status).toBe(MachineStatus.Running)
      expect(t.listeners.size).toBe(1)
    }
    finally { t.cleanup() }
  })

  it.each(['created', 'subscribe'] as const)('preserves a %s failure and explicit recovery', (boundary) => {
    const t = createFixture()
    const failure = new Error(`${boundary} failed`)
    t.hooks[boundary] = () => {
      throw failure
    }
    try {
      let thrown: unknown
      try {
        t.component.init()
      }
      catch (error) { thrown = error }
      expect(thrown).toBe(failure)
      t.hooks[boundary] = undefined
      t.component.destroy()
      expect(t.calls.active).toBe(0)
      expect(t.listeners.size).toBe(0)
      t.component.init()
      expect(t.component.services[1].status).toBe(MachineStatus.Running)
      expect(t.listeners.size).toBe(1)
    }
    finally { t.cleanup() }
  })

  it('preserves a throwing stop and permits the baseline explicit cleanup retry', () => {
    const t = createFixture()
    const failure = new Error('root exit failed')
    let exits = 0
    t.hooks.exit = () => {
      if (++exits === 1)
        throw failure
    }
    try {
      t.component.init()
      let thrown: unknown
      try {
        t.component.destroy()
      }
      catch (error) { thrown = error }
      expect(thrown).toBe(failure)
      // A failed destruction must not suppress a later explicit cleanup.
      expect(t.listeners.size).toBe(0)
      t.component.destroy()
      expect(t.component.services[0].status).toBe(MachineStatus.Stopped)
      expect(t.calls.active).toBe(0)
      expect(t.calls.activityCleanup).toBe(t.calls.acquired)
      const completedExits = exits
      t.component.destroy()
      expect(exits).toBe(completedExits)
    }
    finally { t.cleanup() }
  })
})
