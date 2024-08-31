import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { getState, isIndeterminate } from '../utils'
import { injectCheckboxRootContext } from './root'

export const checkboxIndicatorProps = {
  ...primitiveProps,
  /**
   * @default "span"
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with animation libraries.
   */
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
    return h(Presence, {
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
    }), () => this.$slots.default?.()))
  },
})
