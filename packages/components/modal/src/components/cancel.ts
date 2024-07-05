import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const modalCancelProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type ModalCancelProps = ExtractPublicPropTypes<typeof modalCancelProps>

export const ModalCancel = defineComponent({
  name: 'DestylerModalCancel',
  props: modalCancelProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onOpenChange(false)
      },
    }), () => this.$slots.default?.())
  },
})
