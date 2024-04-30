import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioGroup } from '@destyler/menu'

export const destylerContextMenuRadioGroupProps = {
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
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
} as const

export type DestylerContextMenuRadioGroupProps = ExtractPublicPropTypes<typeof destylerContextMenuRadioGroupProps>

export const DestylerContextMenuRadioGroup = defineComponent({
  name: 'DestylerContextMenuRadioGroup',
  props: destylerContextMenuRadioGroupProps,
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuRadioGroup, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
