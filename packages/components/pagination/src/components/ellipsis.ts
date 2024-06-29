import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const paginationEllipsisProps = {
  ...primitiveProps,
} as const

export type PaginationEllipsisProps = ExtractPublicPropTypes<typeof paginationEllipsisProps>

export const PaginationEllipsis = defineComponent({
  name: 'DestylerPaginationEllipsis',
  props: paginationEllipsisProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'data-type': 'ellipsis',
    }), () => this.$slots.default ? this.$slots.default?.() : '…')
  },
})
