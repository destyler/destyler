import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerContextMenuLabelProps = {
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

export type DestylerContextMenuLabelProps = ExtractPublicPropTypes<typeof destylerContextMenuLabelProps>

export const DestylerContextMenuLabel = defineComponent({
  name: 'DestylerContextMenuLabel',
  props: destylerContextMenuLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(this.as, this.$props, () => this.$slots.default?.())
  },
})
