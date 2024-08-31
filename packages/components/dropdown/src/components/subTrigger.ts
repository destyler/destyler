import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSubTrigger, menuSubTriggerProps } from '@destyler/menu'

export const dropdownSubTriggerProps = {
  ...menuSubTriggerProps,
} as const

export type DropdownSubTriggerProps = ExtractPublicPropTypes<typeof dropdownSubTriggerProps>

export const DropdownSubTrigger = defineComponent({
  name: 'DestylerDropdownSubTrigger',
  props: dropdownSubTriggerProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuSubTrigger, this.$props, () => this.$slots.default?.())
  },
})
