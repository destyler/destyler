import { effectScope } from 'vue'
import type { AnyFn } from './types'

/**
 * Keep states in the global scope to be reusable across Vue instances.
 *
 * @param stateFactory A factory function to create the state
 */
export function createGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
): Fn {
  let initialized = false
  let state: any
  const scope = effectScope(true)

  return ((...args: any[]) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    return state
  }) as Fn
}
