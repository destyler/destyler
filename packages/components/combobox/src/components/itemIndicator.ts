import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxItemContext } from './item'

export const destylerComboboxItemIndicatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
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
