import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow } from '@destyler/menu'

export const destylerMenubarArrowProps = {
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
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'svg',
  },
} as const

export type DestylerMenubarArrowProps = ExtractPublicPropTypes<typeof destylerMenubarArrowProps>

export const DestylerMenubarArrow = defineComponent({
  name: 'DestylerMenubarArrow',
  props: destylerMenubarArrowProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuArrow, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
