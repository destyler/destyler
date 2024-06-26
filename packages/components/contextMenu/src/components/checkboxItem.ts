import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuCheckboxItem, destylerMenuCheckboxItemProps } from '@destyler/menu'

export const destylerContextMenuCheckboxItemProps = {
  ...destylerMenuCheckboxItemProps,
} as const

export type DestylerContextMenuCheckboxItemProps = ExtractPublicPropTypes<typeof destylerContextMenuCheckboxItemProps>

export const DestylerContextMenuCheckboxItem = defineComponent({
  name: 'DestylerContextMenuCheckboxItem',
  props: destylerContextMenuCheckboxItemProps,
  emits: ['update:checked', 'select'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()
    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuCheckboxItem, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
