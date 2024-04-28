import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator } from '@destyler/menu'

export const destylerMenubarSeparatorProps = {
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

export type DestylerMenubarSeparatorProps = ExtractPublicPropTypes<typeof destylerMenubarSeparatorProps>

export const DestylerMenubarSeparator = defineComponent({
  name: 'DestylerMenubarSeparator',
  props: destylerMenubarSeparatorProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
