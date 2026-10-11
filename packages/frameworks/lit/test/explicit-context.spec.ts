import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { createMachine } from '@destyler/xstate'
import { expect, it } from 'vitest'
import { contextSource } from '../src/controllers/context-input'
import { MachineController } from '../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  updateComplete = Promise.resolve(true)
  addController(_controller: ReactiveController) {}
  removeController(_controller: ReactiveController) {}
  requestUpdate() {}
}

it('accepts callable document.all as an explicit source getter in an actual browser', () => {
  expect(typeof document.all).toBe('undefined')
  expect(document.all).not.toBe(undefined)
  let subscriptions = 0
  const source = {
    get: document.all,
    subscribe(listener: (context: Partial<{ count: number }>) => void) {
      subscriptions++
      listener({ count: 7 })
      return () => {
        subscriptions--
      }
    },
  }
  const machine = createMachine<{ count: number }>({ initial: 'idle', context: { count: 0 }, states: { idle: {} } })
  // document.all is callable at runtime despite its legacy typeof result.
  const input = Reflect.apply(contextSource, undefined, [source])
  const controller = new MachineController(new Host(), machine, { context: input, sync: true })
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
