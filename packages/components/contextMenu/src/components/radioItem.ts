import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioItem, destylerMenuRadioItemProps } from '@destyler/menu'

export const destylerContextMenuRadioItemProps = {
  ...destylerMenuRadioItemProps,
} as const

export type DestylerContextMenuRadioItemProps = ExtractPublicPropTypes<typeof destylerContextMenuRadioItemProps>

export const DestylerContextMenuRadioItem = defineComponent({
  name: 'DestylerContextMenuRadioItem',
  props: destylerContextMenuRadioItemProps,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuRadioItem, {
      ...this.$props,
      ...this.emitsAsProps,
    }, () => this.$slots.default?.())
  },
})
