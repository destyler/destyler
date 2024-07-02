import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuCheckboxItem, menuCheckboxItemProps } from '@destyler/menu'

export const menubarCheckboxItemProps = {
  ...menuCheckboxItemProps,
} as const

export type MenubarCheckboxItemProps = ExtractPublicPropTypes<typeof menubarCheckboxItemProps>

export const MenubarCheckboxItem = defineComponent({
  name: 'DestylerMenubarCheckboxItem',
  props: menubarCheckboxItemProps,
  emits: ['update:checked', 'select'],
  setup(props, { emit }) {
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
