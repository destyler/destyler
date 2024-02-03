import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectPortalProps = {
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

export type DestylerSelectPortalProps = ExtractPublicPropTypes<typeof destylerSelectPortalProps>

export const DestylerSelectPortal = defineComponent({
  name: 'DestylerSelectPortal',
  props: destylerSelectPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, this.$slots.default?.())
  },
})
