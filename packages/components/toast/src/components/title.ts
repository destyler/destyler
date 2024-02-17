import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerToastTitleProps = {
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

export type DestylerToastTitleProps = ExtractPublicPropTypes<typeof destylerToastTitleProps>

export const DestylerToastTitle = defineComponent({
  name: 'DestylerToastTitle',
  props: destylerToastTitleProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
