import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerComboboxSeparatorProps = {
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

export type DestylerComboboxSeparatorProps = ExtractPublicPropTypes<typeof destylerComboboxSeparatorProps>

export const DestylerComboboxSeparator = defineComponent({
  name: 'DestylerComboboxSeparator',
  props: destylerComboboxSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-hidden': '',
    }))
  },
})
