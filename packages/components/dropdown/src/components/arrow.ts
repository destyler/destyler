import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuArrow, destylerMenuArrowProps } from '@destyler/menu'

export const destylerDropdownArrowProps = {
  ...destylerMenuArrowProps,
} as const

export type DestylerDropdownArrowProps = ExtractPublicPropTypes<typeof destylerDropdownArrowProps>

export const DestylerDropdownArrow = defineComponent({
  name: 'DestylerDropdownArrow',
  props: destylerDropdownArrowProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuArrow, this.$props, () => this.$slots.default?.())
  },
})
