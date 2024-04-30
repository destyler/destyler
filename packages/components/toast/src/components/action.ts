import { type PropType, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { DestylerToastClose, destylerToastCloseProps } from './close'
import { DestylerToastAnnounceExclude } from './announceExclude'

export const destylerToastActionProps = {
  ...destylerToastCloseProps,
  altText: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerToastActionProps = ExtractPublicPropTypes<typeof destylerToastActionProps>

export const DestylerToastAction = defineComponent({
  name: 'DestylerToastAction',
  inheritAttrs: false,
  props: destylerToastActionProps,
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
        ? h(DestylerToastAnnounceExclude, {
          altText: this.$props.altText,
          asChild: true,
        }, () => h(DestylerToastClose, mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          as: this.$props.as,
          asChild: this.$props.asChild,
        }), () => this.$slots.default?.()))
        : null,
    ]
  },
})
