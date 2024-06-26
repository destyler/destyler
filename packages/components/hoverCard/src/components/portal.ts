import { defineComponent, h } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerHoverCardPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerHoverCardPortalProps = ExtractPublicPropTypes<typeof destylerHoverCardPortalProps>

export const DestylerHoverCardPortal = defineComponent({
  name: 'DestylerHoverCardPortal',
  props: destylerHoverCardPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, () => this.$slots.default?.())
  },
})
