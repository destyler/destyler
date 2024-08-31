import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const paginationPrevProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps,
    default: 'button',
  },
} as const

export type PaginationPrevProps = ExtractPublicPropTypes<typeof paginationPrevProps>

export const PaginationPrev = defineComponent({
  name: 'DestylerPaginationPrev',
  props: paginationPrevProps,

  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-label': 'Prev Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === 1 || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(this.rootContext.page.value - 1)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'Prev Page')
  },
})
