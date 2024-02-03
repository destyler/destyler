import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectItemContext } from './item'

export const destylerSelectInDicatorProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
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
      }), this.$slots.default?.())
      : null
  },
})
