import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerEllipsisPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerEllipsisPortalProps = ExtractPublicPropTypes<typeof destylerEllipsisPortalProps>

export const DestylerEllipsisPortal = defineComponent({
  name: 'DestylerEllipsisPortal',
  props: destylerEllipsisPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
