import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationLastProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerPaginationLastProps = ExtractPublicPropTypes<typeof destylerPaginationLastProps>

export const DestylerPaginationLast = defineComponent({
  name: 'DestylerPaginationLast',
  props: destylerPaginationLastProps,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'Last Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === this.rootContext.pageCount.value || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(this.rootContext.pageCount.value)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'Last page')
  },
})
