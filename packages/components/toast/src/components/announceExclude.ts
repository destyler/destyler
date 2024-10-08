import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const toastAnnounceExcludeProps = {
  ...primitiveProps,
  /**
   * A short description for an alternate way to carry out the action. For screen reader users
   * who will not be able to navigate to the button easily/quickly.
   */
  altText: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type ToastAnnounceExcludeProps = ExtractPublicPropTypes<typeof toastAnnounceExcludeProps>

export const ToastAnnounceExclude = defineComponent({
  name: 'DestylerToastAnnounceExclude',
  props: toastAnnounceExcludeProps,
  render() {
    return h(Primitive, {
      'as': this.as,
      'asChild': this.asChild,
      'data-destyler-toast-announce-exclude': '',
      'data-destyler-toast-announce-alt': this.$props.altText || undefined,
    }, () => this.$slots.default?.())
  },
})
