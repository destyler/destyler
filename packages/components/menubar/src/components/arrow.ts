import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuArrow, menuArrowProps } from '@destyler/menu'

export const menubarArrowProps = {
  ...menuArrowProps,
} as const

export type MenubarArrowProps = ExtractPublicPropTypes<typeof menubarArrowProps>

export const MenubarArrow = defineComponent({
  name: 'DestylerMenubarArrow',
  props: menubarArrowProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuArrow, this.$props, () => this.$slots.default?.())
  },
})
