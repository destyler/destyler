import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationPrevProps = {
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

export type DestylerPaginationPrevProps = ExtractPublicPropTypes<typeof destylerPaginationPrevProps>

export const DestylerPaginationPrev = defineComponent({
  name: 'DestylerPaginationPrev',
  props: destylerPaginationPrevProps,
  setup() {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'Prev Page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'disabled': this.rootContext.page.value === 1 || this.rootContext.disabled.value,
      'onClick': () => {
        this.rootContext.onPageChange(this.rootContext.page.value - 1)
      },
    }), () => this.$slots.default ? this.$slots.default?.() : 'Prev Page')
  },
})
