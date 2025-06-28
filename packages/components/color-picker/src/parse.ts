import type { Color } from '@destyler/color'
import { parseColor } from '@destyler/color'

export function parse(colorString: string): Color {
  return parseColor(colorString)
}
