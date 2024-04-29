import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerModalPortalProps = {
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

export type DestylerModalPortalProps = ExtractPublicPropTypes<typeof destylerModalPortalProps>

export const DestylerModalPortal = defineComponent({
  name: 'DestylerModalPortal',
  props: destylerModalPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, () => this.$slots.default?.())
  },
})
