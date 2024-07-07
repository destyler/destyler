import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'

export const menuPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type MenuPortalProps = ExtractPublicPropTypes<typeof menuPortalProps>

export const MenuPortal = defineComponent({
  name: 'DestylerMenuPortal',
  props: menuPortalProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(TeleportPrimitive, this.$props, () => this.$slots.default?.())
  },
})
