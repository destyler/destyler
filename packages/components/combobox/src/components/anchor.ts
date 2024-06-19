import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperAnchor } from '@destyler/popper'

export const destylerComboboxAnchorProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerComboboxAnchorProps = ExtractPublicPropTypes<typeof destylerComboboxAnchorProps>

export const DestylerComboboxAnchor = defineComponent({
  name: 'DestylerComboboxAnchor',
  props: destylerComboboxAnchorProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerPopperAnchor, {
      asChild: true,
    }, () => {
      return h(DestylerPrimitive, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), {
        default: () => this.$slots.default?.(),
      })
    })
  },
})
