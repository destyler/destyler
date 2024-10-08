import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusItem } from '@destyler/roving-focus'
import { Primitive, primitiveProps } from '@destyler/primitive'

export const toolbarButtonProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * When `true`, prevents the user from interacting with the accordion and all its items
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type ToolbarButtonProps = ExtractPublicPropTypes<typeof toolbarButtonProps>

export const ToolbarButton = defineComponent({
  name: 'DestylerToolbarButton',
  props: toolbarButtonProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(RovingFocusItem, {
      asChild: true,
      focusable: !this.$props.disabled,
    }, {
      default: () => {
        return h(Primitive, mergeProps(this.$props, {
          ref: (el: any) => this.forwardRef(el),
          type: this.$props.as === 'button' ? 'button' : undefined,
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
