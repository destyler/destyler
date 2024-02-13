import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSeparator } from '@destyler/menu'

export const destylerDropdownSeparatorProps = {
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

export type DestylerDropdownSeparatorProps = ExtractPublicPropTypes<typeof destylerDropdownSeparatorProps>

export const DestylerDropdownSeparator = defineComponent({
  name: 'DestylerDropdownSeparator',
  props: destylerDropdownSeparatorProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSeparator, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
