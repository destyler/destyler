import { defineComponent, h } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerMenuLabel, destylerMenuLabelProps } from '@destyler/menu'

export const destylerDropdownLabelProps = {
  ...destylerMenuLabelProps,
} as const

export type DestylerDropdownLabelProps = ExtractPublicPropTypes<typeof destylerDropdownLabelProps>

export const DestylerDropdownLabel = defineComponent({
  name: 'DestylerDropdownLabel',
  props: destylerDropdownLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuLabel, this.$props, () => this.$slots.default?.())
  },
})
