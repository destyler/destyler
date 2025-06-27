import type { Rect } from './types'
import { getElementRect } from './from-element'
import { createRect } from './rect'
import { union } from './union'

export function fromRange(range: Range): Rect {
  let rs: Rect[] = []
  const rects = Array.from(range.getClientRects())

  if (rects.length) {
    rs = rs.concat(rects.map(createRect))
    return union(...rs)
  }

  let start: Node | ParentNode | null = range.startContainer

  if (start.nodeType === Node.TEXT_NODE) {
    start = start.parentNode
  }

  if (start instanceof HTMLElement) {
    const r = getElementRect(start)
    rs.push({ ...r, x: r.maxX, width: 0 })
  }

  return union(...rs)
}
