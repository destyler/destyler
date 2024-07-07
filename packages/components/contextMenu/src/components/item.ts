import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuItem, menuItemProps } from '@destyler/menu'
import { menuItemEmits } from '@destyler/menu/dist/component'

export const contextMenuItemProps = {
  ...menuItemProps,
} as const

export type ContextMenuItemProps = ExtractPublicPropTypes<typeof contextMenuItemProps>

export const contextMenuItemEmits = {
  ...menuItemEmits,
}

export const ContextMenuItem = defineComponent({
  name: 'DestylerContextMenuItem',
  props: contextMenuItemProps,
  emits: contextMenuItemEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
