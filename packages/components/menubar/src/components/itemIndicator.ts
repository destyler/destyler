import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuItemIndicator, destylerMenuItemIndicatorProps } from '@destyler/menu'

export const destylerMenubarItemIndicatorProps = {
  ...destylerMenuItemIndicatorProps,
} as const

export type DestylerMenubarItemIndicatorProps = ExtractPublicPropTypes<typeof destylerMenubarItemIndicatorProps>

export const DestylerMenubarItemIndicator = defineComponent({
  name: 'DestylerMenubarItemIndicator',
  props: destylerMenubarItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
