import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuCheckboxItem } from '@destyler/menu'

export const destylerContextMenuCheckboxItemProps = {
  ...destylerPrimitiveProps,
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  textValue: {
    type: String as PropType<string>,
    required: false,
  },
  checked: {
    type: [Boolean, String] as PropType<CheckedState>,
    required: false,
    default: false,
  },
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
