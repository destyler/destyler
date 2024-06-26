import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuItemIndicator, destylerMenuItemIndicatorProps } from '@destyler/menu'

export const destylerContextMenuItemIndicatorProps = {
  ...destylerMenuItemIndicatorProps,
} as const

export type DestylerContextMenuItemIndicatorProps = ExtractPublicPropTypes<typeof destylerContextMenuItemIndicatorProps>

export const DestylerContextMenuItemIndicator = defineComponent({
  name: 'DestylerContextMenuItemIndicator',
  props: destylerContextMenuItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
