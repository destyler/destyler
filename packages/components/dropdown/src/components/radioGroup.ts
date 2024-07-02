import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuRadioGroup, menuRadioGroupProps } from '@destyler/menu'

export const dropdownRadioGroupProps = {
  ...menuRadioGroupProps,
} as const

export type DropdownRadioGroupProps = ExtractPublicPropTypes<typeof dropdownRadioGroupProps>

export const DropdownRadioGroup = defineComponent({
  name: 'DestylerDropdownRadioGroup',
  props: dropdownRadioGroupProps,
  emits: ['update:modelValue'],
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
