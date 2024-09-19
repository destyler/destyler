import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const paginationFirstProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type PaginationFirstProps = ExtractPublicPropTypes<typeof paginationFirstProps>

export const PaginationFirst = defineComponent({
  name: 'DestylerPaginationFirst',
  props: paginationFirstProps,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-label': 'First Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === 1 || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(1)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'First Page')
  },
})
