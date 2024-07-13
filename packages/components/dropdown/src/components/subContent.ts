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

export const dropdownSubContentProps = {
  ...menuSubContentProps,
} as const

export type DropdownSubContentProps = ExtractPublicPropTypes<typeof dropdownSubContentProps>

export const dropdownSubContentEmits = {
  ...menuSubContentEmits,
}

export const DropdownSubContent = defineComponent({
  name: 'DestylerDropdownSubContent',
  props: dropdownSubContentProps,
  emits: dropdownSubContentEmits,
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
        '--destyler_dropdown_menu_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_dropdown_menu_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_dropdown_menu_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_dropdown_menu_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_dropdown_menu_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => this.$slots.default?.())
  },
})
