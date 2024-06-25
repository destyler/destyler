import { defineComponent, h } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerModalPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerModalPortalProps = ExtractPublicPropTypes<typeof destylerModalPortalProps>

export const DestylerModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: destylerModalPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, () => this.$slots.default?.())
  },
})
