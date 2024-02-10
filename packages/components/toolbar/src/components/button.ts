import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'
import { DestylerPrimitive } from '@destyler/primitive'

export const destylerToolbarButtonProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
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
          ref: 'forwardRef',
          type: this.$props.as === 'button' ? 'button' : undefined,
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
