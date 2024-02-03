import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerMenuGroupProps = {
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
} as const

export type DestylerMenuGroupProps = ExtractPublicPropTypes<typeof destylerMenuGroupProps>

export const DestylerMenuGroup = defineComponent({
  name: 'DestylerMenuGroup',
  props: destylerMenuGroupProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      role: 'group',
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
