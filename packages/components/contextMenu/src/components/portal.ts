import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuPortal, destylerMenuPortalProps } from '@destyler/menu'

export const destylerContextMenuPortalProps = {
  ...destylerMenuPortalProps,
} as const

export type DestylerContextMenuPortalProps = ExtractPublicPropTypes<typeof destylerContextMenuPortalProps>

export const DestylerContextMenuPortal = defineComponent({
  name: 'DestylerContextMenuPortal',
  props: destylerContextMenuPortalProps,
  render() {
    return h(DestylerMenuPortal, this.$props, () => this.$slots.default?.())
  },
})
