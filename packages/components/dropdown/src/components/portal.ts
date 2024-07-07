import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { MenuPortal, menuPortalProps } from '@destyler/menu'

export const dropdownPortalProps = {
  ...menuPortalProps,
} as const

export type DropdownPortalProps = ExtractPublicPropTypes<typeof dropdownPortalProps>

export const DropdownPortal = defineComponent({
  name: 'DestylerDropdownPortal',
  props: dropdownPortalProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(MenuPortal, this.$props, () => this.$slots.default?.())
  },
})
