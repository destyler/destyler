import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { MenuPortal, menuPortalProps } from '@destyler/menu'

export const menubarPortalProps = {
  ...menuPortalProps,
} as const

export type MenubarPortalProps = ExtractPublicPropTypes<typeof menubarPortalProps>

export const MenubarPortal = defineComponent({
  name: 'DestylerMenubarPortal',
  props: menubarPortalProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(MenuPortal, this.$props, () => this.$slots.default?.())
  },
})
