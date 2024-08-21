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
        '--destyler-dropdown-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-dropdown-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-dropdown-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-dropdown-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-dropdown-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
    }), () => this.$slots.default?.())
  },
})
