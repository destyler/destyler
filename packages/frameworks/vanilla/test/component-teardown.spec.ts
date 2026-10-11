import type { ContextSource } from '@destyler/vanilla'
import { Component } from '@destyler/vanilla'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'

interface CounterContext { count: number }
interface CounterState { value: 'idle' }
interface Hooks {
  sourceCleanup?: (component: Counter, call: number) => void
  exit?: (component: Counter, generation: number, call: number) => void
  activityCleanup?: (component: Counter, generation: number) => void
}
type Service = ReturnType<typeof createMachine<CounterContext, CounterState>>

class Counter extends Component<CounterContext, CounterContext, CounterContext, CounterState> {
  services: Service[] = []
  active = new Set<number>()
  cleanups: number[] = []
  exitCalls: number[] = []
  hooks: Hooks = {}

  protected initService(context: CounterContext) {
    const generation = this.services.length
    this.cleanups[generation] = 0
    this.exitCalls[generation] = 0
    const service = createMachine<CounterContext, CounterState>({
      initial: 'idle',
      context: { ...context },
      exit: () => {
        this.exitCalls[generation]++
        this.hooks.exit?.(this, generation, this.exitCalls[generation])
      },
      activities: [() => {
        this.active.add(generation)
        return () => {
          this.active.delete(generation)
          this.cleanups[generation]++
          this.hooks.activityCleanup?.(this, generation)
        }
      }],
      states: { idle: {} },
    })
    this.services.push(service)
    return service
  }

  protected initApi() { return this.service.contextSnapshot }
  protected render() { this.rootEl.textContent = String(this.api.count) }
}

function createSource(count: number, cleanup?: (call: number) => void) {
  const listeners = new Set<(value: Partial<CounterContext>) => void>()
  let cleanupCalls = 0
  const source: ContextSource<CounterContext> = Object.freeze({
    get: () => ({ count }),
    subscribe(listener: (value: Partial<CounterContext>) => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        cleanup?.(++cleanupCalls)
      }
    },
  })
  return { source, listeners, cleanupCalls: () => cleanupCalls }
}

function setup(hooks: Hooks = {}) {
  let component: Counter
  const source = createSource(1, call => hooks.sourceCleanup?.(component, call))
  const options = Object.freeze({ context: source.source })
  component = new Counter(document.createElement('div'), { count: 0 }, options)
  component.hooks = hooks
  const rescue = () => {
    component.hooks = {}
    component.destroy()
    component.services.forEach(service => service.stop())
  }
  return { component, source, options, rescue }
}

function expectReleasedOriginal(component: Counter) {
  expect(component.services).toHaveLength(1)
  expect(component.services[0].status).toBe(MachineStatus.Stopped)
  expect(component.cleanups).toEqual([1])
  expect([...component.active]).toEqual([])
}

describe('component teardown reentry', () => {
  it('ignores init during ContextSource cleanup and preserves another source subscriber', () => {
    const t = setup({ sourceCleanup: (component, call) => {
      if (call === 1)
        component.init()
    } })
    const otherListener = () => {}
    const disposeOther = t.source.source.subscribe(otherListener)
    try {
      t.component.init()
      expect(t.source.listeners.size).toBe(2)
      t.component.destroy()
      t.component.destroy()
      expectReleasedOriginal(t.component)
      expect(t.source.listeners).toEqual(new Set([otherListener]))
      expect(t.source.cleanupCalls()).toBe(1)
    }
    finally {
      t.rescue()
      disposeOther()
    }
  })

  it.each(['exit', 'activityCleanup'] as const)('ignores init from a real machine %s callback', (stage) => {
    const t = setup({ [stage]: (component: Counter) => component.init() })
    try {
      t.component.init()
      t.component.destroy()
      expectReleasedOriginal(t.component)
      expect(t.source.listeners.size).toBe(0)
    }
    finally { t.rescue() }
  })

  it('makes recursive destroy from a real machine exit callback idempotent', () => {
    const t = setup({ exit: (component, generation, call) => {
      if (generation === 0 && call === 1)
        component.destroy()
    } })
    try {
      t.component.init()
      t.component.destroy()
      expectReleasedOriginal(t.component)
      expect(t.component.exitCalls).toEqual([1])
      expect(t.source.cleanupCalls()).toBe(1)
    }
    finally { t.rescue() }
  })

  it('stops the original and allows later init when ContextSource cleanup reenters init then throws', () => {
    const failure = new Error('source cleanup failed')
    const t = setup({ sourceCleanup: (component, call) => {
      if (call === 1) {
        component.init()
        throw failure
      }
    } })
    try {
      t.component.init()
      let thrown: unknown
      try {
        t.component.destroy()
      }
      catch (error) {
        thrown = error
      }
      expect(thrown).toBe(failure)
      expectReleasedOriginal(t.component)
      expect(() => t.component.destroy()).not.toThrow()
      t.component.init()
      expect(t.component.services).toHaveLength(2)
      expect(t.component.services[1].status).toBe(MachineStatus.Running)
      expect(t.source.listeners.size).toBe(1)
      t.component.destroy()
      expect(t.component.cleanups).toEqual([1, 1])
    }
    finally { t.rescue() }
  })

  it.each([false, true])('propagates stop errors and releases the init boundary (source also throws: %s)', (sourceThrows) => {
    const sourceFailure = new Error('source failed before stop')
    const stopFailure = new Error('root exit failed')
    const t = setup({
      sourceCleanup: (_component, call) => {
        if (sourceThrows && call === 1)
          throw sourceFailure
      },
      exit: (component, generation, call) => {
        if (generation === 0 && call === 1) {
          component.init()
          throw stopFailure
        }
      },
    })
    try {
      t.component.init()
      let thrown: unknown
      try {
        t.component.destroy()
      }
      catch (error) {
        thrown = error
      }
      expect(thrown).toBe(stopFailure)
      expect(t.component.services).toHaveLength(1)
      expect(t.source.listeners.size).toBe(0)
      // A throwing root exit aborts stock machine.stop. This test does not
      // claim the engine completed cleanup; its existing exception policy stays intact.
      expect(t.component.services[0].status).toBe(MachineStatus.Running)
      expect(t.component.cleanups).toEqual([0])
      t.component.init()
      expect(t.component.services).toHaveLength(2)
      expect(t.component.services[1].status).toBe(MachineStatus.Running)
      t.component.destroy()
    }
    finally { t.rescue() }
  })

  it('defers options supplied during cleanup until an explicit init after destroy returns', () => {
    const next = createSource(7)
    const nextOptions = Object.freeze({ context: next.source })
    const t = setup({ sourceCleanup: (component, call) => {
      if (call === 1) {
        component.setOptions(nextOptions)
        component.init()
      }
    } })
    try {
      t.component.init()
      t.component.destroy()
      expectReleasedOriginal(t.component)
      expect(next.listeners.size).toBe(0)
      expect(t.options.context).toBe(t.source.source)
      expect(nextOptions.context).toBe(next.source)
      t.component.init()
      expect(t.component.state?.context.count).toBe(7)
      expect(t.component.services[1].status).toBe(MachineStatus.Running)
      expect(next.listeners.size).toBe(1)
      t.component.destroy()
      expect(t.component.cleanups).toEqual([1, 1])
      expect(t.source.listeners.size).toBe(0)
      expect(next.listeners.size).toBe(0)
    }
    finally { t.rescue() }
  })
})
