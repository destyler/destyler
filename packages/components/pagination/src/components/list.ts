import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { type Pages, getRange, transform } from '../utils'
import { injectPaginationRootContext } from './root'

export const paginationListProps = {
  ...primitiveProps,
} as const

export type PaginationListProps = ExtractPublicPropTypes<typeof paginationListProps>

export const PaginationList = defineComponent({
  name: 'DestylerPaginationList',
  props: paginationListProps,
  slots: Object as SlotsType<{
    default: (opts: { items: Pages }) => VNode[]
  }>,
  setup() {
    useForwardExpose()
    const rootContext = injectPaginationRootContext()

    const transformedRange = computed(() => {
      return transform(
        getRange(
          rootContext.page.value,
          rootContext.pageCount.value,
          rootContext.siblingCount.value,
          rootContext.showEdges.value,
        ),
      )
    })

    return {
      rootContext,
      transformedRange,
    }
  },
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.({ items: this.transformedRange }))
  },
})
