import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal } from '@destyler/menu'

export const destylerMenubarPortalProps = {
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

export type DestylerMenubarPortalProps = ExtractPublicPropTypes<typeof destylerMenubarPortalProps>

export const DestylerMenubarPortal = defineComponent({
  name: 'DestylerMenubarPortal',
  props: destylerMenubarPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, () => this.$slots.default?.())
  },
})
