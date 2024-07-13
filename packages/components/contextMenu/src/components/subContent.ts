import type { SlotsType, VNode } from 'vue'
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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
        '--destyler_context_menu_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_context_menu_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_context_menu_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_context_menu_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_context_menu_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => this.$slots.default?.())
  },
})
