import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectIconProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
} as const

export type DestylerSelectIconProps = ExtractPublicPropTypes<typeof destylerSelectIconProps>

export const DestylerSelectIcon = defineComponent({
  name: 'DestylerSelectIcon',
  props: destylerSelectIconProps,
  render() {
    return h(DestylerPrimitive, {
      'aria-hidden': '',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, () => this.$slots.default ? this.$slots.default?.() : '▼')
  },
})
