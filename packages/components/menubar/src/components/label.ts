import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuLabel, menuLabelProps } from '@destyler/menu'

export const menubarLabelProps = {
  ...menuLabelProps,
} as const

export type MenubarLabelProps = ExtractPublicPropTypes<typeof menubarLabelProps>

export const MenubarLabel = defineComponent({
  name: 'DestylerMenubarLabel',
  props: menubarLabelProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(MenuLabel, this.$props, () => this.$slots.default?.())
  },
})
