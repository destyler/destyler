import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDynamicRootContext } from './root'

export const destylerDynamicClearProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerDynamicClearProps = ExtractPublicPropTypes<typeof destylerDynamicClearProps>

export const DestylerDynamicClear = defineComponent({
  name: 'DestylerDynamicClear',
  props: destylerDynamicClearProps,
  setup() {
    useForwardExpose()
    const context = injectDynamicRootContext()

    function handleCancel() {
      if (context.disabled.value)
        return
      context.modelValue.value = []
    }

    return {
      context,
      handleCancel,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'data-disabled': this.context.disabled.value ? '' : undefined,
      'onClick': () => {
        this.handleCancel()
      },
    }), () => this.$slots.default?.())
  },

})
