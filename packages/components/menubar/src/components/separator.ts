import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuSeparator, menuSeparatorProps } from '@destyler/menu'

export const menubarSeparatorProps = {
  ...menuSeparatorProps,
} as const

export type MenubarSeparatorProps = ExtractPublicPropTypes<typeof menubarSeparatorProps>

export const MenubarSeparator = defineComponent({
  name: 'DestylerMenubarSeparator',
  props: menubarSeparatorProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(MenuSeparator, this.$props, () => this.$slots.default?.())
  },
})
