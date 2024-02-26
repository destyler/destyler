import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerSplitterRootProps = {
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

export type DestylerSplitterRootProps = ExtractPublicPropTypes<typeof destylerSplitterRootProps>

export const DestylerSplitterRoot = defineComponent({
  name: 'DestylerSplitterRoot',
  props: destylerSplitterRootProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
