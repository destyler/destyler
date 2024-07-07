import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperAnchor } from '@destyler/popper'

export const comboboxAnchorProps = {
  ...primitiveProps,
} as const

export type ComboboxAnchorProps = ExtractPublicPropTypes<typeof comboboxAnchorProps>

export const ComboboxAnchor = defineComponent({
  name: 'DestylerComboboxAnchor',
  props: comboboxAnchorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(PopperAnchor, {
      asChild: true,
    }, () => {
      return h(Primitive, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), {
        default: () => this.$slots.default?.(),
      })
    })
  },
})
