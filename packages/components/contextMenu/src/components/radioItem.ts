import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuRadioItem, menuRadioItemProps } from '@destyler/menu'

export const contextMenuRadioItemProps = {
  ...menuRadioItemProps,
} as const

export type ContextMenuRadioItemProps = ExtractPublicPropTypes<typeof contextMenuRadioItemProps>

export const ContextMenuRadioItem = defineComponent({
  name: 'DestylerContextMenuRadioItem',
  props: contextMenuRadioItemProps,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuRadioItem, {
      ...this.$props,
      ...this.emitsAsProps,
    }, () => this.$slots.default?.())
  },
})
