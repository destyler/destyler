import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { MenuPortal, menuPortalProps } from '@destyler/menu'

export const contextMenuPortalProps = {
  ...menuPortalProps,
} as const

export type ContextMenuPortalProps = ExtractPublicPropTypes<typeof contextMenuPortalProps>

export const ContextMenuPortal = defineComponent({
  name: 'DestylerContextMenuPortal',
  props: contextMenuPortalProps,
  render() {
    return h(MenuPortal, this.$props, () => this.$slots.default?.())
  },
})
