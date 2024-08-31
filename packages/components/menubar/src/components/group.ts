import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuGroup, menuGroupProps } from '@destyler/menu'

export const menubarGroupProps = {
  ...menuGroupProps,
} as const

export type MenubarGroupProps = ExtractPublicPropTypes<typeof menubarGroupProps>

export const MenubarGroup = defineComponent({
  name: 'DestylerMenubarGroup',
  props: menubarGroupProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuGroup, this.$props, () => this.$slots.default?.())
  },
})
