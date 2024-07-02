import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuRadioItem, menuRadioItemProps } from '@destyler/menu'

export const menubarRadioItemProps = {
  ...menuRadioItemProps,
} as const

export type MenubarRadioItemProps = ExtractPublicPropTypes<typeof menubarRadioItemProps>

export const MenubarRadioItem = defineComponent({
  name: 'DestylerMenubarRadioItem',
  props: menubarRadioItemProps,
  emits: ['select'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(MenuRadioItem, this.forwarded, () => this.$slots.default?.())
  },
})
