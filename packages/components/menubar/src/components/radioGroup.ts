import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioGroup, destylerMenuRadioGroupProps } from '@destyler/menu'

export const destylerMenubarRadioGroupProps = {
  ...destylerMenuRadioGroupProps,
} as const

export type DestylerMenubarRadioGroupProps = ExtractPublicPropTypes<typeof destylerMenubarRadioGroupProps>

export const DestylerMenubarRadioGroup = defineComponent({
  name: 'DestylerMenubarRadioGroup',
  props: destylerMenubarRadioGroupProps,
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
