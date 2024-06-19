import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, renderSlot } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { getState, isIndeterminate } from '../utils'
import { injectCheckboxRootContext } from './root'

export const destylerCheckboxIndicatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerCheckboxIndicatorProps = ExtractPublicPropTypes<typeof destylerCheckboxIndicatorProps>

export const DestylerCheckboxIndicator = defineComponent({
  name: 'DestylerCheckboxIndicator',
  props: destylerCheckboxIndicatorProps,
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
    }, () => h(DestylerPrimitive, mergeProps(this.$attrs, {
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
