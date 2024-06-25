import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalCancelProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerModalCancelProps = ExtractPublicPropTypes<typeof destylerModalCancelProps>

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
    }), () => this.$slots.default?.())
  },
})
