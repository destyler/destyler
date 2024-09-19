import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const dialogCloseProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type DialogCloseProps = ExtractPublicPropTypes<typeof dialogCloseProps>

export const DialogClose = defineComponent({
  name: 'DestylerDialogClose',
  props: dialogCloseProps,
  setup() {
    const rootContext = injectDialogRootContext()

    useForwardExpose()

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
