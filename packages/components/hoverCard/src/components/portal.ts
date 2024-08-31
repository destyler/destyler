import { defineComponent, h } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const hoverCardPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type HoverCardPortalProps = ExtractPublicPropTypes<typeof hoverCardPortalProps>

export const HoverCardPortal = defineComponent({
  name: 'DestylerHoverCardPortal',
  props: hoverCardPortalProps,

  render() {
    return h(TeleportPrimitive, this.$props, () => this.$slots.default?.())
  },
})
