import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectProgressRootContext } from './root'

export const progressIndicatorProps = {
  ...primitiveProps,
} as const

export type ProgressIndicatorProps = ExtractPublicPropTypes<typeof progressIndicatorProps>

export const ProgressIndicator = defineComponent({
  name: 'DestylerProgressIndicator',
  props: progressIndicatorProps,

  setup() {
    const rootContext = injectProgressRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, {
      'data-state': this.rootContext.progressState.value,
      'data-value': this.rootContext.modelValue?.value ?? undefined,
      'data-max': this.rootContext.max.value,
    }), () => this.$slots.default?.())
  },
})
