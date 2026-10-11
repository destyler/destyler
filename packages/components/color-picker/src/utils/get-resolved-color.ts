import type { Color } from '@destyler/color'

// Public context accepts an omitted color; machine initialization resolves it.
export function getResolvedColor(value: Color | undefined): Color {
  if (value === undefined)
    throw new TypeError('Color picker value must be resolved before use')
  return value
}
