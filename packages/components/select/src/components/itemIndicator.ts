import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectItemContext } from './item'

export const selectInDicatorProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SelectInDicatorProps = ExtractPublicPropTypes<typeof selectInDicatorProps>

export const SelectItemIndicator = defineComponent({
  name: 'DestylerSelectItemIndicator',
  props: selectInDicatorProps,
  setup() {
    const itemContext = injectSelectItemContext()

    return {
      itemContext,
    }
  },
  render() {
    if (this.itemContext.isSelected.value) {
      return h(Primitive, mergeProps(this.$props, {
        'aria-hidden': '',
      }), () => this.$slots.default?.())
    }
  },
})
