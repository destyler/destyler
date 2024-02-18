import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationFirstProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
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
    }), {
      default: () => {
        return this.$slots.default ? this.$slots.default?.() : 'First Page'
      },
    })
  },
})
