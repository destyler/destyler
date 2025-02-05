import { type Color, parseColor } from '@zag-js/color-utils'

export function parse(colorString: string): Color {
  return parseColor(colorString)
}
