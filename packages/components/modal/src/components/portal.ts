import { defineComponent, h } from 'vue'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const modalPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type ModalPortalProps = ExtractPublicPropTypes<typeof modalPortalProps>

export const ModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: modalPortalProps,

  render() {
    return h(TeleportPrimitive, this.$props, () => this.$slots.default?.())
  },
})
