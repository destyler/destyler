import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectProgressRootContext } from './root'

export const destylerProgressIndicatorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerProgressIndicatorProps = ExtractPublicPropTypes<typeof destylerProgressIndicatorProps>

export const DestylerProgressIndicator = defineComponent({
  name: 'DestylerProgressIndicator',
  props: destylerProgressIndicatorProps,
  setup() {
    const rootContext = injectProgressRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      'data-state': this.rootContext.progressState.value,
      'data-value': this.rootContext.modelValue?.value ?? undefined,
      'data-max': this.rootContext.max.value,
    }), this.$slots.default?.())
  },
})
