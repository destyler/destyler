import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const popoverPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type PopoverPortalProps = ExtractPublicPropTypes<typeof popoverPortalProps>

export const PopoverPortal = defineComponent({
  name: 'DestylerPopoverPortal',
  props: popoverPortalProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(TeleportPrimitive, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
