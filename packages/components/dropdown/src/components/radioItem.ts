import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuRadioItem } from '@destyler/menu'

export const destylerDropdownRadioItemProps = {
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
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerDropdownRadioItemProps = ExtractPublicPropTypes<typeof destylerDropdownRadioItemProps>

export const DestylerDropdownRadioItem = defineComponent({
  name: 'DestylerDropdownRadioItem',
  props: destylerDropdownRadioItemProps,
  emits: ['select'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerMenuRadioItem, this.forwarded, () => this.$slots.default?.())
  },
})
