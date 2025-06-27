import type { AnyEventObject, EventObject, HookOptions, StateSchema } from '@destyler/xstate'
import type { Accessor } from 'solid-js'
import type { Store } from 'solid-js/store'

export type MachineOptions<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> = Omit<HookOptions<TContext, TState, TEvent>, 'context'> & {
  context?: Store<Partial<TContext>> | Accessor<Partial<TContext>>
}
