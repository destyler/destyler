import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'

import { injectCheckboxRootContext } from './checkboxRoot'
import { getState, isIndeterminate } from './utils'

export const destylerCheckboxIndicatorProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerCheckboxIndicator = defineComponent({
  name: 'DestylerCheckboxIndicator',
  props: destylerCheckboxIndicatorProps,
  setup() {
    const rootContext = injectCheckboxRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || isIndeterminate(this.rootContext.state.value) || this.rootContext.state.value === true,
    }, h(DestylerPrimitive, mergeProps(this.$attrs, {
      'data-state': getState(this.rootContext.state.value),
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'style': {
        pointerEvents: 'none',
      },
    }), this.$slots.default?.()))
  },
})
