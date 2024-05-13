import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import { useForwardExpose } from '@destyler/composition'

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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerRadioGroupIndicatorProps = ExtractPublicPropTypes<typeof destylerRadioGroupIndicatorProps>

export const DestylerRadioGroupIndicator = defineComponent({
  name: 'DestylerRadioGroupindicator',
  props: destylerRadioGroupIndicatorProps,
  setup() {
    const itemContext = injectRadioGroupItemContext()

    const { forwardRef } = useForwardExpose()
    return {
      forwardRef,
      itemContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.itemContext.checked.value,
    }, () => h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'data-state': this.itemContext.checked.value ? 'checked' : 'unchecked',
      'data-disabled': this.itemContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
    }), () => this.$slots.default?.()))
  },
})
