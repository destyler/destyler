import { computed, defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { getRange, transform } from '../utils'
import { injectPaginationRootContext } from './root'

export const destylerPaginationListProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerPaginationListProps = ExtractPublicPropTypes<typeof destylerPaginationListProps>

export const DestylerPaginationList = defineComponent({
  name: 'DestylerPaginationList',
  props: destylerPaginationListProps,
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
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.({ items: this.transformedRange }))
  },
})
