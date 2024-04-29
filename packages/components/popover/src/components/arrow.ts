import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPopperArrow } from '@destyler/popper'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerPopoverArrowProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'svg',
  },
} as const

export type DestylerPopoverArrowProps = ExtractPublicPropTypes<typeof destylerPopoverArrowProps>

export const DestylerPopoverArrow = defineComponent({
  name: 'DestylerPopoverArrow',
  props: destylerPopoverArrowProps,
  render() {
    return h(DestylerPopperArrow, mergeProps(this.$props, {
    }), () => this.$slots.default?.())
  },
})
