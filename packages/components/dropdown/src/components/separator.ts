import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSeparator, menuSeparatorProps } from '@destyler/menu'

export const dropdownSeparatorProps = {
  ...menuSeparatorProps,
} as const

export type DropdownSeparatorProps = ExtractPublicPropTypes<typeof dropdownSeparatorProps>

export const DropdownSeparator = defineComponent({
  name: 'DestylerDropdownSeparator',
  props: dropdownSeparatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
