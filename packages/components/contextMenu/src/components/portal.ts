import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal } from '@destyler/menu'

export const destylerContextMenuPortalProps = {
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

export type DestylerContextMenuPortalProps = ExtractPublicPropTypes<typeof destylerContextMenuPortalProps>

export const DestylerContextMenuPortal = defineComponent({
  name: 'DestylerContextMenuPortal',
  props: destylerContextMenuPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, () => this.$slots.default?.())
  },
})
