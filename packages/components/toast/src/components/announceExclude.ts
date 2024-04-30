import { type Component, type PropType, defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerToastAnnounceExcludeProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  altText: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerToastAnnounceExcludeProps = ExtractPublicPropTypes<typeof destylerToastAnnounceExcludeProps>

export const DestylerToastAnnounceExclude = defineComponent({
  name: 'DestylerToastAnnounceExclude',
  props: destylerToastAnnounceExcludeProps,
  render() {
    return h(DestylerPrimitive, {
      'as': this.as,
      'asChild': this.asChild,
      'data-destyler-toast-announce-exclude': '',
      'data-destyler-toast-announce-alt': this.$props.altText || undefined,
    }, () => this.$slots.default?.())
  },
})
