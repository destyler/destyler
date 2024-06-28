import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuItem, menuItemProps } from '@destyler/menu'

export const contextMenuItemProps = {
  ...menuItemProps,
} as const

export type ContextMenuItemProps = ExtractPublicPropTypes<typeof contextMenuItemProps>

export const ContextMenuItem = defineComponent({
  name: 'DestylerContextMenuItem',
  props: contextMenuItemProps,
  emits: ['select'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
