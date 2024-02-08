import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'

import { injectRadioGroupItemContext } from './groupItem'

export const destylerRadioGroupIndicatorProps = {
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

export type DestylerRadioGroupIndicatorProps = ExtractPublicPropTypes<typeof destylerRadioGroupIndicatorProps>

export const DestylerRadioGroupIndicator = defineComponent({
  name: 'DestylerRadioGroupindicator',
  props: destylerRadioGroupIndicatorProps,
  setup() {
    const itemContext = injectRadioGroupItemContext()

    return {
      itemContext,
    }
  },
  render() {
    return this.itemContext.checked.value
      ? h(DestylerPrimitive, {
        'data-state': this.itemContext.checked.value ? 'checked' : 'unchecked',
        'data-disabled': this.itemContext.disabled.value ? '' : undefined,
        'as': this.$props.as,
        'asChild': this.$props.asChild,
      }, {
        default: () => this.$slots.default?.(),
      })
      : null
  },
})
