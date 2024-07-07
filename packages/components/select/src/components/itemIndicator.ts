import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectItemContext } from './item'

export const selectInDicatorProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SelectInDicatorProps = ExtractPublicPropTypes<typeof selectInDicatorProps>

export const SelectItemIndicator = defineComponent({
  name: 'DestylerSelectItemIndicator',
  props: selectInDicatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const itemContext = injectSelectItemContext()

    return {
      itemContext,
    }
  },
  render() {
    return this.itemContext.isSelected.value
      ? h(Primitive, mergeProps(this.$props, {
        'aria-hidden': '',
      }), () => this.$slots.default?.())
      : null
  },
})
