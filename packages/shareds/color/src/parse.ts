import { HSBColor } from "./hsb"
import { HSLColor } from "./hsl"
import { nativeColorMap } from "./native"
import { RGBColor } from "./rgb"
import type { ColorType } from "./types"

export const parseColor = (value: string): ColorType => {
  if (nativeColorMap.has(value)) {
    return parseColor(nativeColorMap.get(value)!)
  }

  const result = RGBColor.parse(value) || HSBColor.parse(value) || HSLColor.parse(value)

  if (!result) {
    const error = new Error("Invalid color value: " + value)
    Error.captureStackTrace?.(error, parseColor)
    throw error
  }

  return result
}

export const normalizeColor = (v: string | ColorType) => {
  return typeof v === "string" ? parseColor(v) : v
}
