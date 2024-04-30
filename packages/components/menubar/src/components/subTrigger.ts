import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger } from '@destyler/menu'

export const destylerMenubarSubTriggerProps = {
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

export type DestylerMenubarSubTriggerProps = ExtractPublicPropTypes<typeof destylerMenubarSubTriggerProps>

export const DestylerMenubarSubTrigger = defineComponent({
  name: 'DestylerMenubarSubTrigger',
  props: destylerMenubarSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSubTrigger, mergeProps(this.$props, {
      'data-destyler-menubar-subtrigger': '',
    }), () => this.$slots.default?.())
  },
})
