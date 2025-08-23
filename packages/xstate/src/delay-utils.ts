import type { Delay, DelayMap, Dict, EventObject } from './type'
import { isFunction, isNumber, isString } from '@destyler/utils'

/**
 * Delay can be specified as:
 * - a string (reference to `options.delays`)
 * - a number (in ms)
 * - a function that returns a number (in ms)
 *
 * Let's resolve this to a number
 */
export function determineDelayFn<TContext extends Dict, TEvent extends EventObject>(
  delay: Delay<TContext, TEvent> | undefined,
  delaysMap: DelayMap<TContext, TEvent> | undefined,
) {
  return (context: TContext, event: TEvent) => {
    if (isNumber(delay))
      return delay

    if (isFunction(delay)) {
      return delay(context, event)
    }

    if (isString(delay)) {
      const value = Number.parseFloat(delay)

      if (!Number.isNaN(value)) {
        return value
      }

      if (delaysMap) {
        const valueOrFn = delaysMap?.[delay]

        if (valueOrFn === null) {
          throw new Error(
            `[@destyler/xstate > determine-delay] Cannot determine delay for \`${delay}\`. It is set to null in \`options.delays\``,
          )
        }

        return isFunction(valueOrFn) ? valueOrFn(context, event) : valueOrFn
      }
    }
  }
}
