import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuCheckboxItem, menuCheckboxItemProps } from '@destyler/menu'

export const contextMenuCheckboxItemProps = {
  ...menuCheckboxItemProps,
} as const

export type ContextMenuCheckboxItemProps = ExtractPublicPropTypes<typeof contextMenuCheckboxItemProps>

export const ContextMenuCheckboxItem = defineComponent({
  name: 'DestylerContextMenuCheckboxItem',
  props: contextMenuCheckboxItemProps,
  emits: ['update:checked', 'select'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()
    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuCheckboxItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
