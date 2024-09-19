import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuSubContent, menuSubContentProps } from '@destyler/menu'
import { menuSubContentEmits } from '@destyler/menu/component'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const contextMenuSubContentProps = {
  ...menuSubContentProps,
} as const

export type ContextMenuSubContentProps = ExtractPublicPropTypes<typeof contextMenuSubContentProps>

export const contextMenuSubContentEmits = {
  ...menuSubContentEmits,
}

export const ContextMenuSubContent = defineComponent({
  name: 'DestylerContextMenuSubContent',
  props: contextMenuSubContentProps,
  emits: contextMenuSubContentEmits,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(MenuSubContent, mergeProps(this.forwarded, {
      style: {
        '--destyler-context-menu-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-context-menu-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-context-menu-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-context-menu-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-context-menu-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
    }), () => this.$slots.default?.())
  },
})
