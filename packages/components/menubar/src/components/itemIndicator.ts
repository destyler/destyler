import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuItemIndicator, menuItemIndicatorProps } from '@destyler/menu'

export const menubarItemIndicatorProps = {
  ...menuItemIndicatorProps,
} as const

export type MenubarItemIndicatorProps = ExtractPublicPropTypes<typeof menubarItemIndicatorProps>

export const MenubarItemIndicator = defineComponent({
  name: 'DestylerMenubarItemIndicator',
  props: menubarItemIndicatorProps,
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
