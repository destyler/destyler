import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerTeleport } from '@destyler/teleport'

export const destylerMenuPortalProps = {
  to: {
    type: [String, Object] as PropType<string | HTMLElement>,
    required: false,
    default: 'body',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerMenuPortalProps = ExtractPublicPropTypes<typeof destylerMenuPortalProps>

export const DestylerMenuPortal = defineComponent({
  name: 'DestylerMenuPortal',
  props: destylerMenuPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, this.$slots.default?.())
  },
})
