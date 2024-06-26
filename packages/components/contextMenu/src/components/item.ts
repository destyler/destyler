import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuItem, destylerMenuItemProps } from '@destyler/menu'

export const destylerContextMenuItemProps = {
  ...destylerMenuItemProps,
} as const

export type DestylerContextMenuItemProps = ExtractPublicPropTypes<typeof destylerContextMenuItemProps>

export const DestylerContextMenuItem = defineComponent({
  name: 'DestylerContextMenuItem',
  props: destylerContextMenuItemProps,
  emits: ['select'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
