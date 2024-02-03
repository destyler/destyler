import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerMenuSeparatorProps = {
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
} as const

export type DestylerMenuSeparatorProps = ExtractPublicPropTypes<typeof destylerMenuSeparatorProps>

export const DestylerMenuSeparator = defineComponent({
  name: 'DestylerMenuSeparator',
  props: destylerMenuSeparatorProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'role': 'separator',
      'aria-orientation': 'horizontal',
    }), this.$slots.default?.())
  },
})
