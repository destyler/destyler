import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuItemIndicator, destylerMenuItemIndicatorProps } from '@destyler/menu'

export const destylerDropdownItemIndicatorProps = {
  ...destylerMenuItemIndicatorProps,
} as const

export type DestylerDropdownItemIndicatorProps = ExtractPublicPropTypes<typeof destylerDropdownItemIndicatorProps>

export const DestylerDropdownItemIndicator = defineComponent({
  name: 'DestylerDropdownItemIndicator',
  props: destylerDropdownItemIndicatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuItemIndicator, this.$props, () => this.$slots.default?.())
  },
})
