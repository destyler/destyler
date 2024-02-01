import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectSeparatorProps = {
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

export type DestylerSelectSeparatorProps = ExtractPublicPropTypes<typeof destylerSelectSeparatorProps>

export const DestylerSelectSeparator = defineComponent({
  name: 'DestylerSelectSeparator',
  props: destylerSelectSeparatorProps,
  render() {
    return h(DestylerPrimitive, this.$props, this.$slots.default?.())
  },
})
