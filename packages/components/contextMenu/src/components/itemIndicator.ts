import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuItemIndicator, menuItemIndicatorProps } from '@destyler/menu'

export const contextMenuItemIndicatorProps = {
  ...menuItemIndicatorProps,
} as const

export type ContextMenuItemIndicatorProps = ExtractPublicPropTypes<typeof contextMenuItemIndicatorProps>

export const ContextMenuItemIndicator = defineComponent({
  name: 'DestylerContextMenuItemIndicator',
  props: contextMenuItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
