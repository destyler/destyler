import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

export const destylerToolbarButtonProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerToolbarButtonProps = ExtractPublicPropTypes<typeof destylerToolbarButtonProps>

export const DestylerToolbarButton = defineComponent({
  name: 'DestylerToolbarButton',
  props: destylerToolbarButtonProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerRovingFocusItem, {
      asChild: true,
      focusable: !this.$props.disabled,
    }, {
      default: () => {
        return h(DestylerPrimitive, mergeProps(this.$props, {
          ref: (el: any) => this.forwardRef(el),
          type: this.$props.as === 'button' ? 'button' : undefined,
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
