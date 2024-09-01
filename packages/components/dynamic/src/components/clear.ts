import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDynamicRootContext } from './root'

export const dynamicClearProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type DynamicClearProps = ExtractPublicPropTypes<typeof dynamicClearProps>

export const DynamicClear = defineComponent({
  name: 'DestylerDynamicClear',
  props: dynamicClearProps,
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
    return h(Primitive, mergeProps(this.$props, {
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'data-disabled': this.context.disabled.value ? '' : undefined,
      'onClick': () => {
        this.handleCancel()
      },
    }), () => this.$slots.default?.())
  },

})
