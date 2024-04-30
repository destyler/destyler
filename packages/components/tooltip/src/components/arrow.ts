import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPopperArrow } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerTooltipArrowProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
} as const

export type DestylerTooltipArrowProps = ExtractPublicPropTypes<typeof destylerTooltipArrowProps>

export const DestylerTooltipArrow = defineComponent({
  name: 'DestylerTooltipArrow',
  props: destylerTooltipArrowProps,
  render() {
    return h(DestylerPopperArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
