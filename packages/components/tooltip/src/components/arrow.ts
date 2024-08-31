import { defineComponent, h, mergeProps } from 'vue'
import { PopperArrow, popperArrowProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const tooltipArrowProps = {
  ...popperArrowProps,
} as const

export type TooltipArrowProps = ExtractPublicPropTypes<typeof tooltipArrowProps>

export const TooltipArrow = defineComponent({
  name: 'DestylerTooltipArrow',
  props: tooltipArrowProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(PopperArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
