import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator } from '@destyler/menu'

export const destylerContextMenuSeparatorProps = {
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

export type DestylerContextMenuSeparatorProps = ExtractPublicPropTypes<typeof destylerContextMenuSeparatorProps>

export const DestylerContextMenuSeparator = defineComponent({
  name: 'DestylerContextMenuSeparator',
  props: destylerContextMenuSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
