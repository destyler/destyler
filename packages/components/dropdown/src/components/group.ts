import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuGroup } from '@destyler/menu'

export const destylerDropdownGroupProps = {
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

export type DestylerDropdownGroupProps = ExtractPublicPropTypes<typeof destylerDropdownGroupProps>

export const DestylerDropdownGroup = defineComponent({
  name: 'DestylerDropdownGroup',
  props: destylerDropdownGroupProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuGroup, this.$props, () => this.$slots.default?.())
  },
})
