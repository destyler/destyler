import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal, destylerMenuPortalProps } from '@destyler/menu'

export const destylerMenubarPortalProps = {
  ...destylerMenuPortalProps,
} as const

export type DestylerMenubarPortalProps = ExtractPublicPropTypes<typeof destylerMenubarPortalProps>

export const DestylerMenubarPortal = defineComponent({
  name: 'DestylerMenubarPortal',
  props: destylerMenubarPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, () => this.$slots.default?.())
  },
})
