import type { Ref, VNode } from 'vue'

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

export type InternalRenderBody = (
  ref: Ref<HTMLElement | null>,
  onMouseenter: (e: MouseEvent) => void,
  onMouseleave: (e: MouseEvent) => void
) => VNode
