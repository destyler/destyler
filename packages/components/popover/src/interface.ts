import type { Ref, VNode } from 'vue'

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

export type InternalRenderBody = (
  ref: Ref<HTMLElement | null>,
  onMouseenter: (e: MouseEvent) => void,
  onMouseleave: (e: MouseEvent) => void
) => VNode

export interface PopoverInst {
  syncPosition: () => void
  setShow: (value: boolean) => void
}

export type InternalPopoverInst = PopoverInst & {
  getMergedShow: () => boolean
}
