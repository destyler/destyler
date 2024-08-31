import { defineComponent, h, mergeProps } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const ellipsisPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type EllipsisPortalProps = ExtractPublicPropTypes<typeof ellipsisPortalProps>

export const EllipsisPortal = defineComponent({
  name: 'DestylerEllipsisPortal',
  props: ellipsisPortalProps,

  render() {
    return h(TeleportPrimitive, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
