import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperAnchor } from '@destyler/popper'

export const destylerComboboxAnchorProps = {
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
    }, {
      default: () => {
        return h(DestylerPrimitive, mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          as: this.$props.as,
          asChild: this.$props.asChild,
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
