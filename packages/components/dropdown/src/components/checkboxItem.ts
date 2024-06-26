import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuCheckboxItem, destylerMenuCheckboxItemProps } from '@destyler/menu'

export const destylerDropdownCheckboxItemProps = {
  ...destylerMenuCheckboxItemProps,
} as const

export type DestylerDropdownCheckboxItemProps = ExtractPublicPropTypes<typeof destylerDropdownCheckboxItemProps>

export const DestylerDropdownCheckboxItem = defineComponent({
  name: 'DestylerDropdownCheckboxItem',
  props: destylerDropdownCheckboxItemProps,
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
