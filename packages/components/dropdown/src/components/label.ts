import { defineComponent, h } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { MenuLabel, menuLabelProps } from '@destyler/menu'

export const dropdownLabelProps = {
  ...menuLabelProps,
} as const

export type DropdownLabelProps = ExtractPublicPropTypes<typeof dropdownLabelProps>

export const DropdownLabel = defineComponent({
  name: 'DestylerDropdownLabel',
  props: dropdownLabelProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuLabel, this.$props, () => this.$slots.default?.())
  },
})
