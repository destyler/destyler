import { defineComponent, h, mergeProps } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const dialogPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type DialogPortalProps = ExtractPublicPropTypes<typeof dialogPortalProps>

export const DialogPortal = defineComponent({
  name: 'DestylerDialogPortal',
  props: dialogPortalProps,
  render() {
    return h(TeleportPrimitive, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
