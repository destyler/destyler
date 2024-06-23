import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectProgressRootContext } from './root'

export const destylerProgressIndicatorProps = {
  ...destylerPrimitiveProps,
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
    }), () => this.$slots.default?.())
  },
})
