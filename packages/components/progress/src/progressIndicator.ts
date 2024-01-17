import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

import { injectProgressRootContext } from './progressRoot'

export const destylerProgressIndicatorProps = {
  ...destylerPrimitiveProps,
}

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
