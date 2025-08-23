import type { Dict, EventObject, GuardMap, GuardMeta, StateSchema, Transition, TransitionDefinition, Transitions } from './type'
import { isString } from '@destyler/utils'
import { determineGuardFn } from './guard-utils'
import { toArray } from './utils'

/**
 * A transition is an object that describes the next state, or/and actions
 * that should run when an event is sent.
 *
 * Transitions can be specified as:
 * - A single string: "spinning"
 * - An object with `target`, `actions`, or `guard`: { target: "spinning", actions: [...], guard: isValid }
 * - An array of possible transitions. In this case, we'll pick the first matching transition
 * depending on the `guard` specified
 */

export function toTarget<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  target: Transition<TContext, TState, TEvent>,
): TransitionDefinition<TContext, TState, TEvent> {
  return isString(target) ? { target } : target
}

export function determineTransitionFn<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject,
>(transitions: Transitions<TContext, TState, TEvent> | undefined, guardMap: GuardMap<TContext, TState, TEvent>) {
  return (context: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
    return toArray(transitions)
      .map(toTarget)
      .find((transition) => {
        // get condition function
        const determineGuard = determineGuardFn(transition.guard, guardMap)
        const guard = determineGuard(context, event, meta)
        return guard ?? transition.target ?? transition.actions
      })
  }
}
