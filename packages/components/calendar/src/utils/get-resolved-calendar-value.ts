import type { DateValue } from '../types'

export function getResolvedCalendarValue(value: DateValue[] | undefined): DateValue[] {
  if (value === undefined)
    throw new TypeError('Calendar value must be normalized before use')
  return value
}
