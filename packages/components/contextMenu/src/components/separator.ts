import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator, destylerMenuSeparatorProps } from '@destyler/menu'

export const destylerContextMenuSeparatorProps = {
  ...destylerMenuSeparatorProps,
} as const

export type DestylerContextMenuSeparatorProps = ExtractPublicPropTypes<typeof destylerContextMenuSeparatorProps>

export const DestylerContextMenuSeparator = defineComponent({
  name: 'DestylerContextMenuSeparator',
  props: destylerContextMenuSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
