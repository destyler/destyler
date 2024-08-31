import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectToastRootContext } from './rootImpl'
import { ToastAnnounceExclude } from './announceExclude'

export const toastCloseProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type ToastCloseProps = ExtractPublicPropTypes<typeof toastCloseProps>

export const ToastClose = defineComponent({
  name: 'DestylerToastClose',
  inheritAttrs: false,
  props: toastCloseProps,

  setup() {
    const rootContext = injectToastRootContext()
    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(ToastAnnounceExclude, {
      asChild: true,
    }, () => h(Primitive, mergeProps(this.$props, this.$attrs, {
      ref: (el: any) => this.forwardRef(el),
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onClose()
      },
    }), () => this.$slots.default?.()))
  },
})
