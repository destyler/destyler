import { type Component, type PropType, defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDynamicRootContext } from './root'

export const destylerDynamicClearProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
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
    }), {
      default: () => this.$slots.default?.(),
    })
  },

})
