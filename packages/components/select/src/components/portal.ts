import { defineComponent, h } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const selectPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type SelectPortalProps = ExtractPublicPropTypes<typeof selectPortalProps>

export const SelectPortal = defineComponent({
  name: 'DestylerSelectPortal',
  props: selectPortalProps,
  render() {
    return h(TeleportPrimitive, this.$props, () => this.$slots.default?.())
  },
})
