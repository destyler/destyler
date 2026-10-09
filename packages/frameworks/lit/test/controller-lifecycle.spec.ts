import { createMachine, MachineStatus } from '@destyler/xstate'
import { LitElement } from 'lit'
import { describe, expect, it } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

class LifecycleHost extends LitElement {}
customElements.define('destyler-controller-lifecycle-host', LifecycleHost)

describe('lit controller host integration', () => {
  it('supports a controller added after connection and a subsequent disconnect/reconnect', async () => {
    const host = document.createElement('destyler-controller-lifecycle-host') as LifecycleHost
    const service = createMachine({
      id: 'lit.connected-host',
      initial: 'idle',
      context: { count: 0 },
      states: { idle: {} },
    })
    const listeners = new Set<(ctx: { count: number }) => void>()
    let count = 1
    const source = {
      get: () => ({ count }),
      subscribe(listener: (ctx: { count: number }) => void) {
        listeners.add(listener)
        return () => listeners.delete(listener)
      },
    }

    try {
      document.body.append(host)
      await host.updateComplete
      const controller = new MachineController(host, service, { context: source, sync: true })
      expect(service.status).toBe(MachineStatus.Running)
      expect(controller.state.context.count).toBe(1)
      expect(listeners.size).toBe(1)

      host.remove()
      expect(service.status).toBe(MachineStatus.Stopped)
      expect(listeners.size).toBe(0)
      count = 5

      document.body.append(host)
      await host.updateComplete
      expect(service.status).toBe(MachineStatus.Running)
      expect(controller.state.context.count).toBe(5)
      expect(listeners.size).toBe(1)
    }
    finally {
      host.remove()
    }
    expect(listeners.size).toBe(0)
    expect(service.status).toBe(MachineStatus.Stopped)
  })
})
