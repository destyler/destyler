import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuRadioItem, destylerMenuRadioItemProps } from '@destyler/menu'

export const destylerMenubarRadioItemProps = {
  ...destylerMenuRadioItemProps,
} as const

export type DestylerMenubarRadioItemProps = ExtractPublicPropTypes<typeof destylerMenubarRadioItemProps>

export const DestylerMenubarRadioItem = defineComponent({
  name: 'DestylerMenubarRadioItem',
  props: destylerMenubarRadioItemProps,
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
