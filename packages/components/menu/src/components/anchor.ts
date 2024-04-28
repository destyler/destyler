import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes, Measurable } from '@destyler/shared'
import { DestylerPopperAnchor } from '@destyler/popper'

export const destylerMenuAnchorProps = {
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
  element: {
    type: Object as PropType<Measurable>,
  },
} as const

export type DestylerMenuAnchorProps = ExtractPublicPropTypes<typeof destylerMenuAnchorProps>

export const DestylerMenuAnchor = defineComponent({
  name: 'DestylerMenuAnchor',
  props: destylerMenuAnchorProps,
  render() {
    return h(DestylerPopperAnchor, this.$props, () => this.$slots.default?.())
  },
})
