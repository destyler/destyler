import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusItem } from '@destyler/roving-focus'

export const toolbarLinkProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'a',
  },
} as const

export type ToolbarLinkProps = ExtractPublicPropTypes<typeof toolbarLinkProps>

export const ToolbarLink = defineComponent({
  name: 'DestylerToolbarLink',
  props: toolbarLinkProps,

  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(RovingFocusItem, {
      asChild: true,
      focusable: true,
    }, {
      default: () => {
        return h(Primitive, mergeProps(this.$props, {
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
