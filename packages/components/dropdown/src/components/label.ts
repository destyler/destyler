import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuLabel } from '@destyler/menu'

export const destylerDropdownLabelProps = {
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

export type DestylerDropdownLabelProps = ExtractPublicPropTypes<typeof destylerDropdownLabelProps>

export const DestylerDropdownLabel = defineComponent({
  name: 'DestylerDropdownLabel',
  props: destylerDropdownLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuLabel, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
