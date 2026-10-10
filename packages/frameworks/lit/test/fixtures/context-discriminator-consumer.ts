import type { ReactiveControllerHost } from 'lit'
import { MachineController } from '@destyler/lit'
import { createMachine } from '@destyler/xstate'

export function contextDiscriminatorConsumer(host: ReactiveControllerHost) {
  const machine = createMachine<{ count: number }>({
    id: 'context-consumer',
    initial: 'idle',
    context: { count: 0 },
    states: { idle: {} },
  })
  const controller = new MachineController(host, machine, { context: { count: 1 } })
  controller.setOptions({ context: { count: 2 } })
  controller.setOptions({ context: { subscribe: listener => () => listener({ count: 3 }) } })
  controller.setOptions({ context: { get: () => ({ count: 4 }), subscribe: () => () => {} } })
  controller.setOptions({ context: { get: () => undefined, subscribe: () => () => {} } })
  controller.setOptions({ context: { get: undefined, subscribe: () => () => {} } })

  const ordinary = createMachine<{ count: number, subscribe: string, get: string }>({
    id: 'ordinary-context-consumer',
    initial: 'idle',
    context: { count: 0, subscribe: 'initial', get: 'initial' },
    states: { idle: {} },
  })
  const ordinaryController = new MachineController(host, ordinary, {
    context: Object.freeze({ count: 9, subscribe: 'ordinary-data', get: 'ordinary-data' }),
  })
  ordinaryController.setOptions({ context: { count: 10, subscribe: 'updated-data', get: 'updated-data' } })

  const callableData = createMachine<{ count: number, subscribe: () => string, get: string }>({
    id: 'callable-context-consumer',
    initial: 'idle',
    context: { count: 0, subscribe: () => 'ordinary-result', get: 'initial' },
    states: { idle: {} },
  })
  const callableController = new MachineController(host, callableData, {
    context: { count: 11, subscribe: () => 'ordinary-result', get: 'ordinary-data' },
  })

  callableController.setOptions({ context: { get: 'updated-data' } })

  // @ts-expect-error A count-only context cannot use non-callable subscribe as a source.
  controller.setOptions({ context: { subscribe: 'invalid' } })
  // @ts-expect-error A source must return a callable cleanup.
  controller.setOptions({ context: { subscribe: () => 'invalid-cleanup' } })
  // @ts-expect-error A count-only context cannot use non-callable get as a source.
  controller.setOptions({ context: { get: 'invalid', subscribe: () => () => {} } })
  // @ts-expect-error Source updates retain the machine's context value types.
  controller.setOptions({ context: { subscribe: listener => () => listener({ count: 'invalid' }) } })
  // @ts-expect-error Plain context updates retain their value types.
  controller.setOptions({ context: { count: 'invalid' } })
  // @ts-expect-error Null get remains JavaScript compatibility, not the strict TS contract.
  controller.setOptions({ context: { get: null, subscribe: () => () => {} } })
}
