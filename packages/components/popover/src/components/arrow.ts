import { defineComponent, h, mergeProps } from 'vue'
import { PopperArrow, popperArrowProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const popoverArrowProps = {
  ...popperArrowProps,
} as const

export type PopoverArrowProps = ExtractPublicPropTypes<typeof popoverArrowProps>

export const PopoverArrow = defineComponent({
  name: 'DestylerPopoverArrow',
  props: popoverArrowProps,
  render() {
    return h(PopperArrow, mergeProps(this.$props, {
    }), () => this.$slots.default?.())
  },
})
