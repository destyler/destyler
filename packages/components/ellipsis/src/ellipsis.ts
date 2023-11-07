import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { PopoverProps } from '@destyler/popover'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const ellipsisProps = {
  expandTrigger: String as PropType<'click'>,
  tooltip: {
    type: [Boolean, Object] as PropType<PopoverProps | boolean>,
    default: true,
  },
} as const

export type EllipsisProps = ExtractPublicPropTypes<typeof ellipsisProps>

export default defineComponent({
  name: 'DestylerEllipsis',
  inheritAttrs: false,
  props: ellipsisProps,
  setup(props, { slots, attrs }) {
    const triggerRef = ref<HTMLElement | null>(null)
    const triggerInnerRef = ref<HTMLElement | null>(null)
    const tooltipRef = ref<TooltipInst | null>(null)
    const expandedRef = ref(false)
  },
})
