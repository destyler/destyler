import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { MachineController } from '@destyler/lit'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'

class Host implements ReactiveControllerHost {
  controller?: ReactiveController
  updateComplete = Promise.resolve(true)
  addController(controller: ReactiveController) { this.controller = controller }
  removeController() {}
  requestUpdate() {}
}

class ConsumerController extends MachineController<{ count: number }, { value: 'idle' }> {
  public connected: boolean = false
}

describe('controller subclass member ownership', () => {
  it.each([false, true])('preserves a caller connected field while releasing every host lease (connected=%s)', (connected) => {
    let active = 0
    let released = 0
    const service = createMachine<{ count: number }, { value: 'idle' }>({
      initial: 'idle',
      context: { count: 0 },
      activities: [() => {
        active++
        return () => {
          active--
          released++
        }
      }],
      states: { idle: {} },
    })
    const listeners = new Set<(context: Partial<{ count: number }>) => void>()
    const source = {
      subscribe(listener: (context: Partial<{ count: number }>) => void) {
        listeners.add(listener)
        return () => {
          listeners.delete(listener)
        }
      },
    }
    const host = new Host()
    const controller = new ConsumerController(host, service, { context: source, sync: true })
    controller.connected = connected
    try {
      for (let cycle = 0; cycle < 2; cycle++) {
        host.controller!.hostConnected!()
        expect(controller.connected).toBe(connected)
        expect(service.status).toBe(MachineStatus.Running)
        expect(active).toBe(1)
        expect(listeners.size).toBe(1)
        // Consumer writes must not change the controller's connection lifetime.
        controller.connected = !connected
        host.controller!.hostDisconnected!()
        host.controller!.hostDisconnected!()
        expect(controller.connected).toBe(!connected)
        expect(service.status).toBe(MachineStatus.Stopped)
        expect(active).toBe(0)
        expect(released).toBe(cycle + 1)
        expect(listeners.size).toBe(0)
        controller.connected = connected
      }
    }
    finally {
      controller.hostDisconnected()
      service.stop()
    }
  })
})
