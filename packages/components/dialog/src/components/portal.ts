import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport, destylerTeleportProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerDialogPortalProps = {
  ...destylerTeleportProps,
} as const

export type DestylerDialogPortalProps = ExtractPublicPropTypes<typeof destylerDialogPortalProps>

export const DestylerDialogPortal = defineComponent({
  name: 'DestylerDialogPortal',
  props: destylerDialogPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
