import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

import { injectModalRootContext } from './modalRoot'

export const destylerModalCancelProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}
export const DestylerModalCancel = defineComponent({
  name: 'DestylerModalCancel',
  props: destylerModalCancelProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onOpenChange(false)
      },
    }), this.$slots.default?.())
  },
})
