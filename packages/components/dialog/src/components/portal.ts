import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerDialogPortalProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDialogPortalProps = ExtractPublicPropTypes<typeof destylerDialogPortalProps>

export const DestylerDialogPortal = defineComponent({
  name: 'DestylerDialogPortal',
  props: destylerDialogPortalProps,
  render() {
    return h(DestylerTeleport, {
    }, this.$slots.default?.())
  },
})
