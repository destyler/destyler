import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPopperArrow } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerEllipsisArrowProps = {
  ...destylerPrimitiveProps,
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

export type DestylerEllipsisArrowProps = ExtractPublicPropTypes<typeof destylerEllipsisArrowProps>

export const DestylerEllipsisArrow = defineComponent({
  name: 'DestylerEllipsisArrow',
  props: destylerEllipsisArrowProps,
  render() {
    return h(DestylerPopperArrow, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
