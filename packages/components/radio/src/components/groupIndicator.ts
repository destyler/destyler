import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { Presence } from '@destyler/presence'
import { useForwardExpose } from '@destyler/composition'

import { injectRadioGroupItemContext } from './groupItem'

export const radioGroupIndicatorProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type RadioGroupIndicatorProps = ExtractPublicPropTypes<typeof radioGroupIndicatorProps>

export const RadioGroupIndicator = defineComponent({
  name: 'DestylerRadioGroupindicator',
  props: radioGroupIndicatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const itemContext = injectRadioGroupItemContext()

    const { forwardRef } = useForwardExpose()
    return {
      forwardRef,
      itemContext,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.itemContext.checked.value,
    }, () => h(Primitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'data-state': this.itemContext.checked.value ? 'checked' : 'unchecked',
      'data-disabled': this.itemContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
    }), () => this.$slots.default?.()))
  },
})
