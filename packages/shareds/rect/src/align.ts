import type { AlignOptions, HAlign, Rect, VAlign } from './types'
import { createRect } from './rect'

function hAlign(a: Rect, ref: Rect, h: HAlign): Rect {
  let x = ref.minX
  if (h === 'left-inside')
    x = ref.minX
  if (h === 'left-outside')
    x = ref.minX - a.width
  if (h === 'right-inside')
    x = ref.maxX - a.width
  if (h === 'right-outside')
    x = ref.maxX
  if (h === 'center')
    x = ref.midX - a.width / 2
  return createRect({ ...a, x })
}

function vAlign(a: Rect, ref: Rect, v: VAlign): Rect {
  let y = ref.minY
  if (v === 'top-inside')
    y = ref.minY
  if (v === 'top-outside')
    y = ref.minY - a.height
  if (v === 'bottom-inside')
    y = ref.maxY - a.height
  if (v === 'bottom-outside')
    y = ref.maxY
  if (v === 'center')
    y = ref.midY - a.height / 2
  return createRect({ ...a, y })
}

export function alignRect(a: Rect, ref: Rect, options: AlignOptions): Rect {
  const { h, v } = options
  return vAlign(hAlign(a, ref, h), ref, v)
}
