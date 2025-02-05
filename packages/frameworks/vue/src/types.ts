import type { StateMachine } from '@zag-js/core'
import type { ComputedRef, Ref } from 'vue'

export type MachineOptions<
  TContext extends Record<string, any>,
  TState extends StateMachine.StateSchema,
  TEvent extends StateMachine.EventObject = StateMachine.AnyEventObject,
> = Omit<StateMachine.HookOptions<TContext, TState, TEvent>, 'context'> & {
  context?: Ref<StateMachine.UserContext<TContext>> | ComputedRef<StateMachine.UserContext<TContext>>
}
