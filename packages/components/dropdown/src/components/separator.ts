import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator, destylerMenuSeparatorProps } from '@destyler/menu'

export const destylerDropdownSeparatorProps = {
  ...destylerMenuSeparatorProps,
} as const

export type DestylerDropdownSeparatorProps = ExtractPublicPropTypes<typeof destylerDropdownSeparatorProps>

export const DestylerDropdownSeparator = defineComponent({
  name: 'DestylerDropdownSeparator',
  props: destylerDropdownSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
