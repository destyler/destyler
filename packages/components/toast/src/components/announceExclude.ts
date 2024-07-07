import type { PropType, SlotsType } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const toastAnnounceExcludeProps = {
  ...primitiveProps,
  altText: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type ToastAnnounceExcludeProps = ExtractPublicPropTypes<typeof toastAnnounceExcludeProps>

export const ToastAnnounceExclude = defineComponent({
  name: 'DestylerToastAnnounceExclude',
  props: toastAnnounceExcludeProps,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  render() {
    return h(Primitive, {
      'as': this.as,
      'asChild': this.asChild,
      'data-destyler-toast-announce-exclude': '',
      'data-destyler-toast-announce-alt': this.$props.altText || undefined,
    }, () => this.$slots.default?.())
  },
})
