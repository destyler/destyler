import { defineComponent, h, mergeProps, SlotsType, VNode } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const paginationLastProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type PaginationLastProps = ExtractPublicPropTypes<typeof paginationLastProps>

export const PaginationLast = defineComponent({
  name: 'DestylerPaginationLast',
  props: paginationLastProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-label': 'Last Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === this.rootContext.pageCount.value || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(this.rootContext.pageCount.value)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'Last page')
  },
})
