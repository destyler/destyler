import { defineComponent, h } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuGroup } from '@destyler/menu'

export const dropdownGroupProps = {
  ...primitiveProps,
} as const

export type DropdownGroupProps = ExtractPublicPropTypes<typeof dropdownGroupProps>

export const DropdownGroup = defineComponent({
  name: 'DestylerDropdownGroup',
  props: dropdownGroupProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuGroup, this.$props, () => this.$slots.default?.())
  },
})
