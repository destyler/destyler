import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuRadioItem, menuRadioItemProps } from '@destyler/menu'
import { menuRadioItemEmits } from '@destyler/menu/component'

export const dropdownRadioItemProps = {
  ...menuRadioItemProps,
} as const

export type DropdownRadioItemProps = ExtractPublicPropTypes<typeof dropdownRadioItemProps>

export const dropdownRadioItemEmits = {
  ...menuRadioItemEmits,
}

export const DropdownRadioItem = defineComponent({
  name: 'DestylerDropdownRadioItem',
  props: dropdownRadioItemProps,
  emits: dropdownRadioItemEmits,
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
    return h(MenuRadioItem, this.forwarded, () => this.$slots.default?.())
  },
})
