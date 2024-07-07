import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuItemIndicator, menuItemIndicatorProps } from '@destyler/menu'

export const dropdownItemIndicatorProps = {
  ...menuItemIndicatorProps,
} as const

export type DropdownItemIndicatorProps = ExtractPublicPropTypes<typeof dropdownItemIndicatorProps>

export const DropdownItemIndicator = defineComponent({
  name: 'DestylerDropdownItemIndicator',
  props: dropdownItemIndicatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
