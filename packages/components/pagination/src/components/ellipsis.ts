import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerPaginationEllipsisProps = {
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

export type DestylerPaginationEllipsisProps = ExtractPublicPropTypes<typeof destylerPaginationEllipsisProps>

export const DestylerPaginationEllipsis = defineComponent({
  name: 'DestylerPaginationEllipsis',
  props: destylerPaginationEllipsisProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'data-type': 'ellipsis',
    }), {
      default: () => {
        return this.$slots.default ? this.$slots.default?.() : '…'
      },
    })
  },
})
