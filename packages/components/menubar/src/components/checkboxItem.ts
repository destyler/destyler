import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuCheckboxItem, destylerMenuCheckboxItemProps } from '@destyler/menu'

export const destylerMenubarCheckboxItemProps = {
  ...destylerMenuCheckboxItemProps,
} as const

export type DestylerMenubarCheckboxItemProps = ExtractPublicPropTypes<typeof destylerMenubarCheckboxItemProps>

export const DestylerMenubarCheckboxItem = defineComponent({
  name: 'DestylerMenubarCheckboxItem',
  props: destylerMenubarCheckboxItemProps,
  emits: ['update:checked', 'select'],
  setup(props, { emit }) {
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
