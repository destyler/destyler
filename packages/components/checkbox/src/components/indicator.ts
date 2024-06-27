import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, renderSlot } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { getState, isIndeterminate } from '../utils'
import { injectCheckboxRootContext } from './root'

export const checkboxIndicatorProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type CheckboxIndicatorProps = ExtractPublicPropTypes<typeof checkboxIndicatorProps>

export const CheckboxIndicator = defineComponent({
  name: 'DestylerCheckboxIndicator',
  props: checkboxIndicatorProps,
  setup() {
    const rootContext = injectCheckboxRootContext()

    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || isIndeterminate(this.rootContext.state.value) || this.rootContext.state.value === true,
    }, () => h(Primitive, mergeProps(this.$attrs, {
      'ref': el => this.forwardRef(el),
      'data-state': getState(this.rootContext.state.value),
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'style': {
        pointerEvents: 'none',
      },
    }), () => renderSlot(this.$slots, 'default')))
  },
})
