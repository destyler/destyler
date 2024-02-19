import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxItemContext } from './item'

export const destylerComboboxItemIndicatorProps = {
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
} as const

export type DestylerComboboxItemIndicatorProps = ExtractPublicPropTypes<typeof destylerComboboxItemIndicatorProps>

export const DestylerComboboxItemIndicator = defineComponent({
  name: 'DestylerComboboxItemIndicator',
  props: destylerComboboxItemIndicatorProps,
  setup() {
    useForwardExpose()
    const itemContext = injectComboboxItemContext()

    return {
      itemContext,
    }
  },
  render() {
    if (this.itemContext.isSelected.value) {
      return h(DestylerPrimitive, mergeProps(this.$props, {
        'aria-hidden': '',
      }), {
        default: () => this.$slots.default?.(),
      })
    }
  },
})
