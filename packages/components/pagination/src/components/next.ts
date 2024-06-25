import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationNextProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerPaginationNextProps = ExtractPublicPropTypes<typeof destylerPaginationNextProps>

export const DestylerPaginationNext = defineComponent({
  name: 'DestylerPaginationNext',
  props: destylerPaginationNextProps,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'Next Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === this.rootContext.pageCount.value || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(this.rootContext.page.value + 1)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'Next Page')
  },
})
