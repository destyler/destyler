import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuCheckboxItem, menuCheckboxItemProps } from '@destyler/menu'
import { menuCheckboxItemEmits } from '@destyler/menu/dist/component'

export const menubarCheckboxItemProps = {
  ...menuCheckboxItemProps,
} as const

export type MenubarCheckboxItemProps = ExtractPublicPropTypes<typeof menubarCheckboxItemProps>

export const menubarCheckboxItemEmits = {
  ...menuCheckboxItemEmits,
}

export const MenubarCheckboxItem = defineComponent({
  name: 'DestylerMenubarCheckboxItem',
  props: menubarCheckboxItemProps,
  emits: menubarCheckboxItemEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuCheckboxItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
