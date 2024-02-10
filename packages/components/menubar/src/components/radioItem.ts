import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuRadioItem } from '@destyler/menu'

export const destylerMenubarRadioItemProps = {
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

export type DestylerMenubarRadioItemProps = ExtractPublicPropTypes<typeof destylerMenubarRadioItemProps>

export const DestylerMenubarRadioItem = defineComponent({
  name: 'DestylerMenubarRadioItem',
  props: destylerMenubarRadioItemProps,
  emits: ['select'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerMenuRadioItem, this.forwarded, {
      default: () => this.$slots.default?.(),
    })
  },
})
