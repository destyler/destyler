import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { PopperArrow, popperArrowProps } from '@destyler/popper'

export const menuArrowProps = {
  ...popperArrowProps,
} as const

export type MenuArrowProps = ExtractPublicPropTypes<typeof menuArrowProps>

export const MenuArrow = defineComponent({
  name: 'DestylerMenuArrow',
  props: menuArrowProps,
  render() {
    return h(PopperArrow, this.$props, () => this.$slots.default?.())
  },
})
