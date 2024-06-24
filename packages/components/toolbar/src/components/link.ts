import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'

export const destylerToolbarLinkProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'a',
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
          ref: (el: any) => this.forwardRef(el),
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
