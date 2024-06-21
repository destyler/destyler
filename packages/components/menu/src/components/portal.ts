import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'

export const destylerMenuPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerMenuPortalProps = ExtractPublicPropTypes<typeof destylerMenuPortalProps>

export const DestylerMenuPortal = defineComponent({
  name: 'DestylerMenuPortal',
  props: destylerMenuPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, () => this.$slots.default?.())
  },
})
