import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerPopperArrow } from '@destyler/popper'

const destylerMenuArrowProps = {
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

export type DestylerMenuArrowProps = ExtractPublicPropTypes<typeof destylerMenuArrowProps>

export const DestylerMenuArrow = defineComponent({
  name: 'DestylerMenuArrow',
  props: destylerMenuArrowProps,
  render() {
    return h(DestylerPopperArrow, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
