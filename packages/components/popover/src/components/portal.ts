import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerTeleport } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerPopoverPortalProps = {
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

export type DestylerPopoverPortalProps = ExtractPublicPropTypes<typeof destylerPopoverPortalProps>

export const DestylerPopoverPortal = defineComponent({
  name: 'DestylerPopoverPortal',
  props: destylerPopoverPortalProps,
  render() {
    return h(DestylerTeleport, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
