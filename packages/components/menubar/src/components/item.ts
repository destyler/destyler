import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuItem, menuItemProps } from '@destyler/menu'
import { menuItemEmits } from '@destyler/menu/dist/component'

export const menubarItemProps = {
  ...menuItemProps,
} as const

export type MenubarItemProps = ExtractPublicPropTypes<typeof menubarItemProps>

export const menubarItemEmits = {
  ...menuItemEmits,
}

export const MenubarItem = defineComponent({
  name: 'DestylerMenubarItem',
  props: menubarItemProps,
  emits: menubarItemEmits,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
