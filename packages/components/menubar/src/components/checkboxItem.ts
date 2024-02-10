import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { CheckedState, ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuCheckboxItem } from '@destyler/menu'

export const destylerMenubarCheckboxItemProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
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
    return h(DestylerMenuCheckboxItem, mergeProps(this.$props, this.emitsAsProps), {
      default: () => this.$slots.default?.(),
    })
  },
})
