import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

import { injectSelectItemContext } from './selectItem'

export const destylerSelectInDicatorProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
}

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
