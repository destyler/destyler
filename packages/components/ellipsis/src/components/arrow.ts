import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { TooltipArrow, tooltipArrowProps } from '@destyler/tooltip'

export const ellipsisArrowProps = {
  ...tooltipArrowProps,
} as const

export type EllipsisArrowProps = ExtractPublicPropTypes<typeof ellipsisArrowProps>

export const EllipsisArrow = defineComponent({
  name: 'DestylerEllipsisArrow',
  props: ellipsisArrowProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(TooltipArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
