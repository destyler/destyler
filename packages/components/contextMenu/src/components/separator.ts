import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSeparator, menuSeparatorProps } from '@destyler/menu'

export const contextMenuSeparatorProps = {
  ...menuSeparatorProps,
} as const

export type ContextMenuSeparatorProps = ExtractPublicPropTypes<typeof contextMenuSeparatorProps>

export const ContextMenuSeparator = defineComponent({
  name: 'DestylerContextMenuSeparator',
  props: contextMenuSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
