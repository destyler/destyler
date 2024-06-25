import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPopperArrow, destylerPopperArrowProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerTooltipArrowProps = {
  ...destylerPopperArrowProps,
} as const

export type DestylerTooltipArrowProps = ExtractPublicPropTypes<typeof destylerTooltipArrowProps>

export const DestylerTooltipArrow = defineComponent({
  name: 'DestylerTooltipArrow',
  props: destylerTooltipArrowProps,
  render() {
    return h(DestylerPopperArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
