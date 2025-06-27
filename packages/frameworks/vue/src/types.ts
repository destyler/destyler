import type { AnyEventObject, EventObject, HookOptions, StateSchema, UserContext } from '@destyler/xstate'
import type { ComputedRef, Ref } from 'vue'

export type MachineOptions<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> = Omit<HookOptions<TContext, TState, TEvent>, 'context'> & {
  context?: Ref<UserContext<TContext>> | ComputedRef<UserContext<TContext>>
}
