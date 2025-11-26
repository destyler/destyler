import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

class HostStub implements ReactiveControllerHost {
  controllers = new Set<ReactiveController>()
  requestUpdate = vi.fn<ReactiveControllerHost['requestUpdate']>()
  updateComplete: ReactiveControllerHost['updateComplete'] = Promise.resolve(true)

  addController(controller: ReactiveController): void {
    this.controllers.add(controller)
  }

  removeController(controller: ReactiveController): void {
    this.controllers.delete(controller)
  }
}

describe('machineController', () => {
  it('starts the machine and notifies the host on state changes', () => {
    const host = new HostStub()
    const machine = createMachine({
      id: 'lit.lifecycle',
      initial: 'idle',
      context: {},
      states: {
        idle: { on: { GO: 'done' } },
        done: {},
      },
    })

    const stopSpy = vi.spyOn(machine, 'stop')

    const controller = new MachineController(host, machine, { sync: true })
    controller.hostConnected()

    expect(machine.status).toBe(MachineStatus.Running)

    machine.send({ type: 'GO' } as any)

    expect(controller.state.value).toBe('done')
    expect(host.requestUpdate).toHaveBeenCalled()

    controller.hostDisconnected()
    expect(stopSpy).toHaveBeenCalledTimes(1)
  })

  it('applies context sources and forwards updated options', () => {
    const host = new HostStub()
    const machine = createMachine({
      id: 'lit.context',
      initial: 'idle',
      context: { count: 0 },
      states: {
        idle: {},
      },
    })

    const setContextSpy = vi.spyOn(machine, 'setContext')
    const setOptionsSpy = vi.spyOn(machine, 'setOptions')

    let unsubscribeCalled = false
    let emit: ((ctx: { count: number }) => void) | undefined

    const contextSource = {
      get: () => ({ count: 1 }),
      subscribe: (fn: (ctx: { count: number }) => void) => {
        emit = fn
        return () => {
          unsubscribeCalled = true
        }
      },
    }

    const controller = new MachineController(host, () => machine, {
      context: contextSource,
      actions: { noop: () => {} },
    })

    controller.hostConnected()

    expect(setContextSpy).toHaveBeenCalledWith({ count: 1 })

    controller.setOptions({ actions: { another: () => {} } })
    expect(setOptionsSpy).toHaveBeenLastCalledWith({ actions: { another: expect.any(Function) } })

    emit?.({ count: 3 })
    expect(machine.contextSnapshot.count).toBe(3)
    expect(host.requestUpdate).toHaveBeenCalled()

    controller.hostDisconnected()
    expect(unsubscribeCalled).toBe(true)
  })
})
