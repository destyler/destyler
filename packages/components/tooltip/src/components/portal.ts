import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerTooltipPortalProps = {
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

export type DestylerTooltipPortalProps = ExtractPublicPropTypes<typeof destylerTooltipPortalProps>

export const DestylerTooltipPortal = defineComponent({
  name: 'DestylerTooltipPortal',
  props: destylerTooltipPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), this.$slots.default?.())
  },
})
