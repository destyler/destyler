import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { TeleportPrimitive, teleportPrimitiveProps } from '@destyler/teleport'

export const comboboxPortalProps = {
  ...teleportPrimitiveProps,
} as const

export type ComboboxPortalProps = ExtractPublicPropTypes<typeof comboboxPortalProps>

export const ComboboxPortal = defineComponent({
  name: 'DestylerComboboxPortal',
  props: comboboxPortalProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(TeleportPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
