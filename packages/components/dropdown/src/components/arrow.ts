import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuArrow, menuArrowProps } from '@destyler/menu'

export const dropdownArrowProps = {
  ...menuArrowProps,
} as const

export type DropdownArrowProps = ExtractPublicPropTypes<typeof dropdownArrowProps>

export const DropdownArrow = defineComponent({
  name: 'DestylerDropdownArrow',
  props: dropdownArrowProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(MenuArrow, this.$props, () => this.$slots.default?.())
  },
})
