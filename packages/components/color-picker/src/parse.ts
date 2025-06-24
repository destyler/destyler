import type { Color } from '@zag-js/color-utils'
import { parseColor } from '@zag-js/color-utils'

export function parse(colorString: string): Color {
  return parseColor(colorString)
}
