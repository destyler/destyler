import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuRadioItem, destylerMenuRadioItemProps } from '@destyler/menu'

export const destylerDropdownRadioItemProps = {
  ...destylerMenuRadioItemProps,
} as const

export type DestylerDropdownRadioItemProps = ExtractPublicPropTypes<typeof destylerDropdownRadioItemProps>

export const DestylerDropdownRadioItem = defineComponent({
  name: 'DestylerDropdownRadioItem',
  props: destylerDropdownRadioItemProps,
  emits: ['select'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerMenuRadioItem, this.forwarded, () => this.$slots.default?.())
  },
})
