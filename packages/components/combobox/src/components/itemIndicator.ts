import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxItemContext } from './item'

export const comboboxItemIndicatorProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type ComboboxItemIndicatorProps = ExtractPublicPropTypes<typeof comboboxItemIndicatorProps>

export const ComboboxItemIndicator = defineComponent({
  name: 'DestylerComboboxItemIndicator',
  props: comboboxItemIndicatorProps,
  setup() {
    useForwardExpose()
    const itemContext = injectComboboxItemContext()

    return {
      itemContext,
    }
  },
  render() {
    if (this.itemContext.isSelected.value) {
      return h(Primitive, mergeProps(this.$props, {
        'aria-hidden': '',
      }), {
        default: () => this.$slots.default?.(),
      })
    }
  },
})
