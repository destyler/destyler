import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerTooltipPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerTooltipPortalProps = ExtractPublicPropTypes<typeof destylerTooltipPortalProps>

export const DestylerTooltipPortal = defineComponent({
  name: 'DestylerTooltipPortal',
  props: destylerTooltipPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
