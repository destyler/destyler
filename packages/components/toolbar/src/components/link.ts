import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'

export const destylerToolbarLinkProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'a',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerToolbarLinkProps = ExtractPublicPropTypes<typeof destylerToolbarLinkProps>

export const DestylerToolbarLink = defineComponent({
  name: 'DestylerToolbarLink',
  props: destylerToolbarLinkProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerRovingFocusItem, {
      asChild: true,
      focusable: true,
    }, {
      default: () => {
        return h(DestylerPrimitive, mergeProps(this.$props, {
          ref: this.forwardRef,
          onKeydown: (event: KeyboardEvent) => {
            if (event.key === ' ')
              (event.currentTarget as HTMLElement)?.click()
          },
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
