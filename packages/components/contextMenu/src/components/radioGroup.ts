import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioGroup, destylerMenuRadioGroupProps } from '@destyler/menu'

export const destylerContextMenuRadioGroupProps = {
  ...destylerMenuRadioGroupProps,
} as const

export type DestylerContextMenuRadioGroupProps = ExtractPublicPropTypes<typeof destylerContextMenuRadioGroupProps>

export const DestylerContextMenuRadioGroup = defineComponent({
  name: 'DestylerContextMenuRadioGroup',
  props: destylerContextMenuRadioGroupProps,
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
