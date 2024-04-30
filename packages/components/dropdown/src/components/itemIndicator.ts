import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuItemIndicator } from '@destyler/menu'

export const destylerDropdownItemIndicatorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDropdownItemIndicatorProps = ExtractPublicPropTypes<typeof destylerDropdownItemIndicatorProps>

export const DestylerDropdownItemIndicator = defineComponent({
  name: 'DestylerDropdownItemIndicator',
  props: destylerDropdownItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
