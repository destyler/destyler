import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuArrow, menuArrowProps } from '@destyler/menu'

export const contextMenuArrowProps = {
  ...menuArrowProps,
} as const

export type ContextMenuArrowProps = ExtractPublicPropTypes<typeof contextMenuArrowProps>

export const ContextMenuArrow = defineComponent({
  name: 'DestylerContextMenuArrow',
  props: contextMenuArrowProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuArrow, this.$props, () => this.$slots.default?.())
  },
})
