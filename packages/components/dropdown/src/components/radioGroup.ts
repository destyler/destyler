import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuRadioGroup, menuRadioGroupProps } from '@destyler/menu'
import { menuRadioGroupEmits } from '@destyler/menu/dist/component'

export const dropdownRadioGroupProps = {
  ...menuRadioGroupProps,
} as const

export type DropdownRadioGroupProps = ExtractPublicPropTypes<typeof dropdownRadioGroupProps>

export const dropdownRadioGroupEmits = {
  ...menuRadioGroupEmits,
}

export const DropdownRadioGroup = defineComponent({
  name: 'DestylerDropdownRadioGroup',
  props: dropdownRadioGroupProps,
  emits: dropdownRadioGroupEmits,
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
    return h(MenuRadioGroup, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
