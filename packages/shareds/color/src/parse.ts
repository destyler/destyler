import type { ColorType } from './types'
import { HSBColor } from './hsb'
import { HSLColor } from './hsl'
import { nativeColorMap } from './native'
import { RGBColor } from './rgb'

export function parseColor(value: string): ColorType {
  if (nativeColorMap.has(value)) {
    return parseColor(nativeColorMap.get(value)!)
  }

  const result = RGBColor.parse(value) || HSBColor.parse(value) || HSLColor.parse(value)

  if (!result) {
    const error = new Error(`Invalid color value: ${value}`)
    Error.captureStackTrace?.(error, parseColor)
    throw error
  }

  return result
}

export function normalizeColor(v: string | ColorType) {
  return typeof v === 'string' ? parseColor(v) : v
}
