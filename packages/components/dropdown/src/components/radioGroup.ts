import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioGroup, destylerMenuRadioGroupProps } from '@destyler/menu'

export const destylerDropdownRadioGroupProps = {
  ...destylerMenuRadioGroupProps,
} as const

export type DestylerDropdownRadioGroupProps = ExtractPublicPropTypes<typeof destylerDropdownRadioGroupProps>

export const DestylerDropdownRadioGroup = defineComponent({
  name: 'DestylerDropdownRadioGroup',
  props: destylerDropdownRadioGroupProps,
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()
    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuRadioGroup, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
