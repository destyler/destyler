import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuRadioGroup, menuRadioGroupProps } from '@destyler/menu'

export const menubarRadioGroupProps = {
  ...menuRadioGroupProps,
} as const

export type MenubarRadioGroupProps = ExtractPublicPropTypes<typeof menubarRadioGroupProps>

export const MenubarRadioGroup = defineComponent({
  name: 'DestylerMenubarRadioGroup',
  props: menubarRadioGroupProps,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuRadioGroup, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
