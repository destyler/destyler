import type { Actions, AnyEventObject, ChooseHelper, Dict, EventObject, Guard, GuardExpression, GuardHelper, GuardMap, GuardMeta, PureActions, StateSchema } from './type'
import { isFunction, isString } from '@destyler/utils'
import { isGuardHelper } from './utils'

const Truthy = () => true

/* -----------------------------------------------------------------------------
 * The following functions are used to determine a guard's truthiness
 * ----------------------------------------------------------------------------- */

function exec<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  guardMap: Dict,
  ctx: TContext,
  event: TEvent,
  meta: GuardMeta<TContext, TState, TEvent>,
) {
  return (guard: Guard<TContext, TState, TEvent>) => {
    if (isString(guard)) {
      return !!guardMap[guard]?.(ctx, event, meta)
    }
    if (isFunction(guard)) {
      return guard(ctx, event, meta)
    }
    return guard.predicate(guardMap)(ctx, event, meta)
  }
}

/* -----------------------------------------------------------------------------
 * Guard helpers (for combining guards)
 * ----------------------------------------------------------------------------- */

function or<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  ...conditions: Array<Guard<TContext, TState, TEvent>>
): GuardHelper<TContext, TState, TEvent> {
  return {
    predicate: (guardMap: Dict) => (ctx: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
      const execFn = exec(guardMap, ctx, event, meta)
      for (const condition of conditions) {
        if (execFn(condition)) {
          return true
        }
      }
      return false
    },
  }
}

function and<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  ...conditions: Array<Guard<TContext, TState, TEvent>>
): GuardHelper<TContext, TState, TEvent> {
  return {
    predicate: (guardMap: Dict) => (ctx: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
      const execFn = exec(guardMap, ctx, event, meta)
      for (const condition of conditions) {
        if (!execFn(condition)) {
          return false
        }
      }
      return true
    },
  }
}

function not<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  condition: Guard<TContext, TState, TEvent>,
): GuardHelper<TContext, TState, TEvent> {
  return {
    predicate: (guardMap: Dict) => (ctx: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
      return !exec(guardMap, ctx, event, meta)(condition)
    },
  }
}

function stateIn<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  ...values: TState['value'][]
): GuardExpression<TContext, TState, TEvent> {
  return (_ctx, _evt, meta) => meta.state.matches(...values)
}

export const guards = { or, and, not, stateIn }

/* -----------------------------------------------------------------------------
 * Action guard helper. Used to determie the action to be taken
 * ----------------------------------------------------------------------------- */

export function choose<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  actions: Array<{ guard?: Guard<TContext, TState, TEvent>, actions: PureActions<TContext, TState, TEvent> }>,
): ChooseHelper<TContext, TState, TEvent> {
  return {
    predicate: (guardMap: Dict) => (ctx: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) =>
      actions.find((def) => {
        const guard = def.guard ?? Truthy
        return exec(guardMap, ctx, event, meta)(guard)
      })?.actions,
  }
}

/* -----------------------------------------------------------------------------
 * Function to determine the guard to be used
 * ----------------------------------------------------------------------------- */

export function determineGuardFn<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  guard: Guard<TContext, TState, TEvent> | undefined,
  guardMap: GuardMap<TContext, TState, TEvent>,
) {
  guard = guard ?? Truthy
  return (context: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
    if (isString(guard)) {
      const value = guardMap[guard]
      return isFunction(value) ? value(context, event, meta) : value
    }

    if (isGuardHelper(guard)) {
      return guard.predicate(guardMap)(context, event, meta)
    }

    return guard?.(context, event, meta)
  }
}

/* -----------------------------------------------------------------------------
 * Function to determine the actions to be taken
 * ----------------------------------------------------------------------------- */

export function determineActionsFn<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  values: Actions<TContext, TState, TEvent> | undefined,
  guardMap: GuardMap<TContext, TState, TEvent>,
) {
  return (context: TContext, event: TEvent, meta: GuardMeta<TContext, TState, TEvent>) => {
    if (isGuardHelper(values)) {
      return values.predicate(guardMap)(context, event, meta)
    }
    return values
  }
}
