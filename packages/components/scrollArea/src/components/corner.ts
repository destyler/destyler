import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectScrollAreaRootContext } from './root'
import { DestylerScrollAreaCornerImpl } from './cornerImpl'

export const destylerScrollAreaCorner = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerScrollAreaCornerProps = ExtractPublicPropTypes<typeof destylerScrollAreaCorner>

export const DestylerScrollAreaCorner = defineComponent({
  name: 'DestylerScrollAreaCorner',
  props: destylerScrollAreaCorner,
  setup() {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectScrollAreaRootContext()

    const hasBothScrollbarsVisible = computed(
      () => !!rootContext.scrollbarX.value && !!rootContext.scrollbarY.value,
    )
    const hasCorner = computed(
      () => rootContext.type.value !== 'scroll' && hasBothScrollbarsVisible.value,
    )

    return {
      forwardRef,
      hasCorner,
    }
  },
  render() {
    return this.hasCorner
      ? h(DestylerScrollAreaCornerImpl, mergeProps(this.$props, {
        ref: (el: any) => this.forwardRef(el),
      }), {
        default: () => this.$slots.default?.(),
      })
      : null
  },
})
