import { defineComponent, h } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerSelectPortalProps = ExtractPublicPropTypes<typeof destylerSelectPortalProps>

export const DestylerSelectPortal = defineComponent({
  name: 'DestylerSelectPortal',
  props: destylerSelectPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, () => this.$slots.default?.())
  },
})
