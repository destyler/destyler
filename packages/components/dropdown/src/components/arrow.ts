import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow } from '@destyler/menu'

export const destylerDropdownArrowProps = {
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

export type DestylerDropdownArrowProps = ExtractPublicPropTypes<typeof destylerDropdownArrowProps>

export const DestylerDropdownArrow = defineComponent({
  name: 'DestylerDropdownArrow',
  props: destylerDropdownArrowProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuArrow, this.$props, () => this.$slots.default?.())
  },
})
