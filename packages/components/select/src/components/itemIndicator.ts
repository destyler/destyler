import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectItemContext } from './item'

export const destylerSelectInDicatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerSelectInDicatorProps = ExtractPublicPropTypes<typeof destylerSelectInDicatorProps>

export const DestylerSelectItemIndicator = defineComponent({
  name: 'DestylerSelectItemIndicator',
  props: destylerSelectInDicatorProps,
  setup() {
    const itemContext = injectSelectItemContext()

    return {
      itemContext,
    }
  },
  render() {
    return this.itemContext.isSelected.value
      ? h(DestylerPrimitive, mergeProps(this.$props, {
        'aria-hidden': '',
      }), () => this.$slots.default?.())
      : null
  },
})
