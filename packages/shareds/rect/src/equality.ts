import type { Point, RectInit, Size } from './types'

export function isSizeEqual (a: Size, b: Size) {
  return a.width === b.width && a.height === b.height
}

export function isPointEqual (a: Point, b: Point) {
  return a.x === b.x && a.y === b.y
}

export function isRectEqual (a: RectInit, b: RectInit) {
  return isPointEqual(a, b) && isSizeEqual(a, b)
}
