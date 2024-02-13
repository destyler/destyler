import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger } from '@destyler/menu'

export const destylerDropdownSubTriggerProps = {
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
} as const

export type DestylerDropdownSubTriggerProps = ExtractPublicPropTypes<typeof destylerDropdownSubTriggerProps>

export const DestylerDropdownSubTrigger = defineComponent({
  name: 'DestylerDropdownSubTrigger',
  props: destylerDropdownSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSubTrigger, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
