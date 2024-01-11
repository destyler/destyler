import type { VNode } from 'vue'
import { isValidVNodeElement } from '@destyler/shared'
import { DestylerSlottable } from './slot'

export function isSlottable(child: VNode): child is VNode {
  return (
    isValidVNodeElement(child)
    && (child.type === DestylerSlottable)
  )
}
