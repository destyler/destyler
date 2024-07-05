import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { PopperArrow } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const ellipsisArrowProps = {
  ...primitiveProps,
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

export type EllipsisArrowProps = ExtractPublicPropTypes<typeof ellipsisArrowProps>

export const EllipsisArrow = defineComponent({
  name: 'DestylerEllipsisArrow',
  props: ellipsisArrowProps,
  render() {
    return h(PopperArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
