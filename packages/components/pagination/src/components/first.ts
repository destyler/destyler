import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationFirstProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerPaginationFirstProps = ExtractPublicPropTypes<typeof destylerPaginationFirstProps>

export const DestylerPaginationFirst = defineComponent({
  name: 'DestylerPaginationFirst',
  props: destylerPaginationFirstProps,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'First Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === 1 || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(1)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'First Page')
  },
})
