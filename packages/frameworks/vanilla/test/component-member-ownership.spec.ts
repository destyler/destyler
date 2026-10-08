import type { ContextSource } from '@destyler/vanilla'
import { Component } from '@destyler/vanilla'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'

interface Context { count: number, created: boolean }
interface State { value: 'idle' }
type Service = ReturnType<typeof createMachine<Context, State>>

class ConsumerCounter extends Component<Context, Context, Context, State> {
  ready: boolean = false
  destroying: boolean = false
  services: Service[] = []
  renders: Context[] = []
  cleanups: number[] = []

  protected initService(context: Context) {
    const generation = this.services.length
    this.cleanups[generation] = 0
    const service = createMachine<Context, State>({
      initial: 'idle',
      context: { ...context },
      created: ctx => ctx.created = true,
      activities: [() => () => this.cleanups[generation]++],
      states: { idle: {} },
    })
    this.services.push(service)
    return service
  }

  protected initApi() { return this.service.contextSnapshot }
  protected render() { this.renders.push({ ...this.api }) }
}

describe('component subclass member ownership', () => {
  it.each([false, true])('keeps caller ready and destroying fields through normal restarts (destroying=%s)', (destroying) => {
    const component = new ConsumerCounter(document.createElement('div'), { count: 0, created: false })
    component.ready = false
    component.destroying = destroying
    try {
      component.init()
      expect(component.services).toHaveLength(1)
      expect(component.services[0].status).toBe(MachineStatus.Running)
      expect(component.ready).toBe(false)
      expect(component.destroying).toBe(destroying)
      component.destroy()
      expect(component.services[0].status).toBe(MachineStatus.Stopped)
      expect(component.ready).toBe(false)
      expect(component.destroying).toBe(destroying)
      component.init()
      expect(component.services).toHaveLength(2)
      expect(component.services[1].status).toBe(MachineStatus.Running)
      expect(component.ready).toBe(false)
      expect(component.destroying).toBe(destroying)
      component.destroy()
      expect(component.cleanups).toEqual([1, 1])
    }
    finally {
      component.destroy()
      component.services.forEach(service => service.stop())
    }
  })

  it('guards eager source rendering independently of caller ready=true', () => {
    const listeners = new Set<(context: Partial<Context>) => void>()
    const source: ContextSource<Context> = {
      subscribe(listener) {
        listeners.add(listener)
        listener({ count: 3 })
        return () => {
          listeners.delete(listener)
        }
      },
    }
    const component = new ConsumerCounter(document.createElement('div'), { count: 0, created: false }, { context: source })
    component.ready = true
    try {
      component.init()
      expect(component.renders.length).toBeGreaterThan(0)
      expect(component.renders.every(snapshot => snapshot.created)).toBe(true)
      expect(component.state?.context.count).toBe(3)
      expect(component.ready).toBe(true)
      component.destroy()
      expect(component.ready).toBe(true)
      expect(listeners.size).toBe(0)
    }
    finally {
      component.destroy()
      component.services.forEach(service => service.stop())
    }
  })

  it('keeps teardown active when a context cleanup changes the caller destroying field', () => {
    let component: ConsumerCounter
    let calls = 0
    const source: ContextSource<Context> = {
      subscribe: () => () => {
        if (++calls === 1) {
          component.destroying = false
          component.init()
        }
      },
    }
    component = new ConsumerCounter(document.createElement('div'), { count: 0, created: false }, { context: source })
    try {
      component.init()
      component.destroy()
      expect(component.services).toHaveLength(1)
      expect(component.services[0].status).toBe(MachineStatus.Stopped)
      expect(component.cleanups).toEqual([1])
      expect(component.destroying).toBe(false)
    }
    finally {
      component.destroy()
      component.services.forEach(service => service.stop())
    }
  })
})
