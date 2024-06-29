import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuItem, menuItemProps } from '@destyler/menu'

export const menubarItemProps = {
  ...menuItemProps,
} as const

export type MenubarItemProps = ExtractPublicPropTypes<typeof menubarItemProps>

export const MenubarItem = defineComponent({
  name: 'DestylerMenubarItem',
  props: menubarItemProps,
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
