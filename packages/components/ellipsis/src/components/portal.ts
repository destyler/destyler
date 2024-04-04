import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerEllipsisPortalProps = {
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

export type DestylerEllipsisPortalProps = ExtractPublicPropTypes<typeof destylerEllipsisPortalProps>

export const DestylerEllipsisPortal = defineComponent({
  name: 'DestylerEllipsisPortal',
  props: destylerEllipsisPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
