import type { CheckedState, Direction } from '@destyler/shared'

export const ITEM_NAME = 'MenuItem'
export const ITEM_SELECT = 'menu.itemSelect'
export const SELECTION_KEYS = ['Enter', ' ']
export const FIRST_KEYS = ['ArrowDown', 'PageUp', 'Home']
export const LAST_KEYS = ['ArrowUp', 'PageDown', 'End']
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS]
export const SUB_OPEN_KEYS: Record<Direction, string[]> = {
  ltr: [...SELECTION_KEYS, 'ArrowRight'],
  rtl: [...SELECTION_KEYS, 'ArrowLeft'],
}
export const SUB_CLOSE_KEYS: Record<Direction, string[]> = {
  ltr: ['ArrowLeft'],
  rtl: ['ArrowRight'],
}

export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function isIndeterminate(
  checked?: CheckedState,
): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

export function getCheckedState(checked: CheckedState) {
  return isIndeterminate(checked)
    ? 'indeterminate'
    : checked
      ? 'checked'
      : 'unchecked'
}

export interface Point {
  x: number
  y: number
}
export type Polygon = Point[]
export type Side = 'left' | 'right'
export interface GraceIntent {
  area: Polygon
  side: Side
}
