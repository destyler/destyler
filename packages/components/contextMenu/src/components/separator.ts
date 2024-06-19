import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator } from '@destyler/menu'

export const destylerContextMenuSeparatorProps = {
  ...destylerPrimitiveProps,
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
