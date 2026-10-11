import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { Component } from '../src/component'

class Counter extends Component<{ count: number }, { count: number, ready: boolean }, { count: number, ready: boolean }> {
  renders: { count: number, ready: boolean }[] = []

  get status() {
    return this.service?.status
  }

  protected initService(context: { count: number }) {
    return createMachine({
      id: 'vanilla.component.lifecycle',
      initial: 'idle',
      context: { ...context, ready: false },
      created: ctx => ctx.ready = true,
      states: { idle: {} },
    })
  }

  protected initApi() {
    return this.service.contextSnapshot
  }

  protected render() {
    this.renders.push(this.api)
    this.rootEl.textContent = String(this.api.count)
  }
}

function createSource(count = 1, eager = false) {
  const listeners = new Set<(ctx: { count: number }) => void>()
  const unsubscribes: ReturnType<typeof vi.fn>[] = []
  return {
    listeners,
    unsubscribes,
    get: () => ({ count }),
    subscribe(listener: (ctx: { count: number }) => void) {
      listeners.add(listener)
      if (eager)
        listener({ count })
      const unsubscribe = vi.fn(() => listeners.delete(listener))
      unsubscribes.push(unsubscribe)
      return unsubscribe
    },
    emit(value: number) {
      count = value
      listeners.forEach(listener => listener({ count }))
    },
  }
}

describe('vanilla Component lifecycle', () => {
  it('stores context options before initialization without starting a subscription', () => {
    const source = createSource(2)
    const component = new Counter(document.createElement('div'), { count: 0 })
    try {
      component.setOptions({ context: source })
      expect(source.listeners.size).toBe(0)
      expect(component.state).toBeUndefined()
      component.init()
      expect(component.state?.context.count).toBe(2)
      expect(source.listeners.size).toBe(1)
    }
    finally {
      component.destroy()
    }
    expect(source.listeners.size).toBe(0)
  })

  it('does not render eager source emissions before created initialization', () => {
    const source = createSource(2, true)
    const component = new Counter(document.createElement('div'), { count: 0 }, { context: source })
    try {
      component.init()
      expect(component.renders.length).toBeGreaterThan(0)
      expect(component.renders.every(snapshot => snapshot.ready)).toBe(true)
    }
    finally {
      component.destroy()
    }
    expect(source.listeners.size).toBe(0)
  })

  it('releases resources exactly once across repeated destroy and reinitialization', () => {
    const source = createSource()
    const component = new Counter(document.createElement('div'), { count: 0 }, { context: source })
    component.init()
    component.destroy()
    component.destroy()
    expect(source.unsubscribes[0]).toHaveBeenCalledTimes(1)
    expect(source.listeners.size).toBe(0)
    source.emit(5)
    const priorRenderCount = component.renders.length

    try {
      component.init()
      expect(component.state?.context.count).toBe(5)
      expect(component.state?.context.ready).toBe(true)
      expect(component.renders.length).toBeGreaterThan(priorRenderCount)
      expect(source.listeners.size).toBe(1)
    }
    finally {
      component.destroy()
    }
    expect(source.unsubscribes[1]).toHaveBeenCalledTimes(1)
    expect(source.listeners.size).toBe(0)
  })

  it('keeps options supplied after destruction dormant until the next init', () => {
    const source = createSource(10)
    const component = new Counter(document.createElement('div'), { count: 0 })
    component.init()
    component.destroy()
    const renders = component.renders.length
    component.setOptions({ context: source })
    expect(source.listeners.size).toBe(0)
    source.emit(11)
    expect(component.renders.length).toBe(renders)

    try {
      component.init()
      expect(component.state?.context.count).toBe(11)
      expect(source.listeners.size).toBe(1)
    }
    finally {
      component.destroy()
    }
    expect(source.listeners.size).toBe(0)
  })

  it('detaches a cleared context source and leaves the component running', () => {
    const source = createSource()
    const component = new Counter(document.createElement('div'), { count: 0 }, { context: source })
    try {
      component.init()
      component.setOptions({ context: undefined })
      expect(source.listeners.size).toBe(0)
      source.emit(5)
      expect(component.state?.context.count).toBe(1)
      expect(component.state?.value).toBe('idle')
      expect(component.status).toBe(MachineStatus.Running)
    }
    finally {
      component.destroy()
    }
  })

  it('replaces active sources without continuing to observe the old source', async () => {
    const first = createSource(1)
    const next = createSource(2, true)
    const root = document.createElement('div')
    const component = new Counter(root, { count: 0 }, { context: first })
    try {
      component.init()
      component.setOptions({ context: next })
      expect(first.listeners.size).toBe(0)
      expect(next.listeners.size).toBe(1)
      expect(component.state?.context.count).toBe(2)
      expect(root.textContent).toBe('2')

      first.emit(99)
      expect(component.state?.context.count).toBe(2)
      next.emit(3)
      await expect.poll(() => root.textContent).toBe('3')
      expect(component.renders.every(snapshot => snapshot.ready)).toBe(true)
    }
    finally {
      component.destroy()
    }
    expect(next.listeners.size).toBe(0)
  })

  it('still stops the owned service if an external unsubscribe throws', () => {
    const failure = new Error('unsubscribe failed')
    const unsubscribe = vi.fn(() => {
      throw failure
    })
    const source = { get: () => ({ count: 1 }), subscribe: () => unsubscribe }
    const component = new Counter(document.createElement('div'), { count: 0 }, { context: source })
    component.init()
    expect(() => component.destroy()).toThrow(failure)
    expect(component.status).toBe(MachineStatus.Stopped)
    expect(() => component.destroy()).not.toThrow()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
