import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const destylerDialogCloseProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerDialogCloseProps = ExtractPublicPropTypes<typeof destylerDialogCloseProps>

export const DestylerDialogClose = defineComponent({
  name: 'DestylerDialogClose',
  props: destylerDialogCloseProps,
  setup() {
    const rootContext = injectDialogRootContext()

    useForwardExpose()

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
