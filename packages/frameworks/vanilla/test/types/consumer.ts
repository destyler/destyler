import type { ComponentOptions } from '@destyler/vanilla'
import type { Machine, XState } from '@destyler/xstate'
import { Component } from '@destyler/vanilla'
import { createMachine } from '@destyler/xstate'

interface UserContext {
  value: string
}

interface MachineContext extends UserContext {
  internalCount: number
}

interface State {
  value: 'idle' | 'active'
}

type Event = { type: 'INCREMENT' } | { type: 'UPDATE', value: string }

class Consumer extends Component<UserContext, { count: number }, MachineContext, State, Event> {
  protected initService(context: UserContext): Machine<MachineContext, State, Event> {
    return createMachine<MachineContext, State, Event>({
      context: { ...context, internalCount: 0 },
      initial: 'idle',
      states: { idle: {}, active: {} },
    })
  }

  protected initApi() {
    return { count: this.service.state.context.internalCount }
  }

  protected render() {}

  inspectInheritedTransition(state: Parameters<typeof this.onTransition>[0]) {
    const context: MachineContext = state.context
    const count: number = state.context.internalCount
    const value: string = state.context.value
    const machineState: State['value'] | null = state.value
    const event: Event = state.event
    const snapshot: XState<MachineContext, State, Event> = state
    // @ts-expect-error transition context must retain its numeric internal type
    const wrongCount: string = state.context.internalCount
    // @ts-expect-error unknown context fields must not be any
    void state.context.missing
    // @ts-expect-error the machine's event union must not widen
    const wrongEvent: { type: 'UNKNOWN' } = state.event
    void [context, count, value, machineState, event, snapshot, wrongCount, wrongEvent]
  }
}

const options: ComponentOptions<UserContext, MachineContext, State, Event> = {
  context: { value: 'controlled' },
  actions: {
    increment(context) {
      context.internalCount++
    },
  },
}
const instance = new Consumer(document.createElement('div'), { value: 'initial' }, options)
instance.init()
instance.send?.('INCREMENT')
// @ts-expect-error unsupported events must not become accepted through declarations
instance.send?.('UNKNOWN')
instance.destroy()
