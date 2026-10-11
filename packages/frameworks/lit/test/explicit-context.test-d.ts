import type { ContextInput, ContextSource } from '@destyler/lit'
import type { ReactiveControllerHost } from 'lit'
import { contextSource, contextValue, MachineController } from '@destyler/lit'
import { createMachine } from '@destyler/xstate'

declare const host: ReactiveControllerHost
const machine = createMachine<{ count: number }>({ initial: 'idle', context: { count: 0 }, states: { idle: {} } })
const controller = new MachineController(host, machine, { context: contextValue({ count: 1 }) })
const value: ContextInput<{ count: number }> = contextValue({ count: 2 })
controller.setOptions({ context: value })
controller.setOptions({ context: contextValue({}) })

const source: ContextSource<{ count: number }> = {
  get: () => ({ count: 3 }),
  subscribe(listener) {
    listener({ count: 4 })
    return () => {}
  },
}
controller.setOptions({ context: contextSource(source) })
controller.setOptions({ context: contextSource({ get: () => undefined, subscribe: () => () => {} }) })
controller.setOptions({ context: contextSource<{ count: number }>({
  subscribe(listener) {
    listener({ count: 5 })
    // @ts-expect-error Source updates keep the selected context's value types.
    listener({ count: 'invalid' })
    return () => {}
  },
}) })
controller.setOptions({ context: contextSource({
  subscribe(listener) {
    listener({ count: 6 })
    // @ts-expect-error Inline source listeners infer the machine's value types.
    listener({ count: 'invalid' })
    return () => {}
  },
}) })
// Both existing source forms remain accepted without wrapping.
controller.setOptions({ context: source })
controller.setOptions({ context: { count: 6 } })

// @ts-expect-error Inline explicit values must retain the machine's context types.
controller.setOptions({ context: contextValue({ count: 'invalid' }) })
const invalidValue = contextValue({ count: 'invalid' })
// @ts-expect-error A stored wrapper cannot erase incompatible field types.
controller.setOptions({ context: invalidValue })
const invalidFrozenValue = contextValue(Object.freeze({ count: 'invalid' }))
// @ts-expect-error Readonly input fields must not disappear from wrapper inference.
controller.setOptions({ context: invalidFrozenValue })
// @ts-expect-error Constructor inference must not widen the machine's context.
const invalidController = new MachineController(host, machine, { context: contextValue({ count: 'invalid' }) })
void invalidController
// @ts-expect-error A source getter must return the machine's context types.
controller.setOptions({ context: contextSource({ get: () => ({ count: 'invalid' }), subscribe: () => () => {} }) })
// @ts-expect-error A source requires a callable subscribe.
contextSource({ get: () => ({ count: 1 }), subscribe: 'invalid' })
// @ts-expect-error A source must return a callable cleanup.
contextSource({ subscribe: () => 'invalid' })
// @ts-expect-error An explicit source cannot have an ordinary non-callable get.
contextSource({ get: 'invalid', subscribe: () => () => {} })
// @ts-expect-error Null get is not part of the strict source contract.
contextSource({ get: null, subscribe: () => () => {} })

const callableData = { count: 7, get: () => 'data', subscribe: () => 'data' }
const callableMachine = createMachine({ initial: 'idle', context: callableData, states: { idle: {} } })
const callableController = new MachineController(host, callableMachine, { context: contextValue(callableData) })
void callableController

const computedMachine = createMachine<{ count: number, readonly doubled: number }>({
  initial: 'idle',
  context: { count: 0 },
  computed: { doubled: context => context.count * 2 },
  states: { idle: {} },
})
const computedController = new MachineController(host, computedMachine)
computedController.setOptions({ context: contextValue({ count: 1 }) })
// @ts-expect-error Explicit ordinary context cannot target a readonly computed field.
computedController.setOptions({ context: contextValue({ doubled: 2 }) })
const computedValue = contextValue(Object.freeze({ doubled: 2 }))
// @ts-expect-error Stored readonly inputs cannot bypass the writable-context contract.
computedController.setOptions({ context: computedValue })
