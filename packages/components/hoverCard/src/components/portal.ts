import { type PropType, defineComponent, h } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerHoverCardPortalProps = {
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

export type DestylerHoverCardPortalProps = ExtractPublicPropTypes<typeof destylerHoverCardPortalProps>

export const DestylerHoverCardPortal = defineComponent({
  name: 'DestylerHoverCardPortal',
  props: destylerHoverCardPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
