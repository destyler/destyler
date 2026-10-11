import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { createMachine } from '@destyler/xstate'
import { expect, it } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  updateComplete = Promise.resolve(true)
  addController(_controller: ReactiveController) {}
  removeController(_controller: ReactiveController) {}
  requestUpdate() {}
}

it('preserves the legacy callable document.all get path in an actual browser', () => {
  expect(typeof document.all).toBe('undefined')
  expect(document.all).not.toBe(undefined)
  let subscriptions = 0
  const context = {
    count: 99,
    get: document.all,
    subscribe(listener: (context: Partial<{ count: number }>) => void) {
      subscriptions++
      listener({ count: 7 })
      return () => {
        subscriptions--
      }
    },
  }
  const machine = createMachine({
    initial: 'idle',
    context: { count: 0 },
    states: { idle: {} },
  })
  const controller = new MachineController(new Host(), machine, { context, sync: true })
  try {
    expect(controller.state.context.count).toBe(0)
    controller.hostConnected()
    expect(subscriptions).toBe(1)
    expect(controller.state.context.count).toBe(7)
  }
  finally {
    controller.hostDisconnected()
  }
  expect(subscriptions).toBe(0)
})
