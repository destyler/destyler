import { type PropType, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { ToastClose, toastCloseProps } from './close'
import { ToastAnnounceExclude } from './announceExclude'

export const toastActionProps = {
  ...toastCloseProps,
  altText: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type ToastActionProps = ExtractPublicPropTypes<typeof toastActionProps>

export const ToastAction = defineComponent({
  name: 'DestylerToastAction',
  inheritAttrs: false,
  props: toastActionProps,
  setup(props) {
    if (!props.altText)
      throw new Error('Missing prop `altText` expected on `DestylerToastAction`')

    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return [
      this.$props.altText
        ? h(ToastAnnounceExclude, {
          altText: this.$props.altText,
          asChild: true,
        }, () => h(ToastClose, mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          as: this.$props.as,
          asChild: this.$props.asChild,
        }), () => this.$slots.default?.()))
        : null,
    ]
  },
})
