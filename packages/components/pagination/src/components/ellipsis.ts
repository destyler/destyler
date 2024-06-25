import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerPaginationEllipsisProps = {
  ...destylerPrimitiveProps,
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
    }), () => this.$slots.default ? this.$slots.default?.() : '…')
  },
})
