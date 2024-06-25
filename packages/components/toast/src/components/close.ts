import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectToastRootContext } from './rootImpl'
import { DestylerToastAnnounceExclude } from './announceExclude'

export const destylerToastCloseProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerToastCloseProps = ExtractPublicPropTypes<typeof destylerToastCloseProps>

export const DestylerToastClose = defineComponent({
  name: 'DestylerToastClose',
  inheritAttrs: false,
  props: destylerToastCloseProps,
  setup() {
    const rootContext = injectToastRootContext()
    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerToastAnnounceExclude, {
      asChild: true,
    }, () => h(DestylerPrimitive, mergeProps(this.$props, this.$attrs, {
      ref: (el: any) => this.forwardRef(el),
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onClose()
      },
    }), () => this.$slots.default?.()))
  },
})
