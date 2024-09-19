import { defineComponent, h, mergeProps } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const tooltipPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type TooltipPortalProps = ExtractPublicPropTypes<typeof tooltipPortalProps>

export const TooltipPortal = defineComponent({
  name: 'DestylerTooltipPortal',
  props: tooltipPortalProps,
  render() {
    return h(TeleportPrimitive, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
