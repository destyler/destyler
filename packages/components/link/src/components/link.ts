import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerLinkProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  href: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
} as const

export type DestylerLinkProps = ExtractPublicPropTypes<typeof destylerLinkProps>

export const DestylerLink = defineComponent({
  name: 'DestylerLink',
  inheritAttrs: false,
  props: destylerLinkProps,
  setup(_) {

  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      'as': 'a',
      'asChild': this.$props.asChild,
      'role': 'link',
      'href': this.$props.disabled ? undefined : this.$props.href,
      'tabindex': this.$props.disabled ? undefined : 0,
      'aria-disabled': this.$props.disabled ? true : undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
