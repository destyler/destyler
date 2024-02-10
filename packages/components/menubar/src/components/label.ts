import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuLabel } from '@destyler/menu'

export const destylerMenubarLabelProps = {
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

export type DestylerMenubarLabelProps = ExtractPublicPropTypes<typeof destylerMenubarLabelProps>

export const DestylerMenubarLabel = defineComponent({
  name: 'DestylerMenubarLabel',
  props: destylerMenubarLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuLabel, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
