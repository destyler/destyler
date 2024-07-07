import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectScrollAreaRootContext } from './root'
import { ScrollAreaCornerImpl } from './cornerImpl'

export const scrollAreaCorner = {
  ...primitiveProps,
} as const

export type ScrollAreaCornerProps = ExtractPublicPropTypes<
  typeof scrollAreaCorner
>

export const ScrollAreaCorner = defineComponent({
  name: 'DestylerScrollAreaCorner',
  props: scrollAreaCorner,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectScrollAreaRootContext()

    const hasBothScrollbarsVisible = computed(
      () => !!rootContext.scrollbarX.value && !!rootContext.scrollbarY.value,
    )
    const hasCorner = computed(
      () =>
        rootContext.type.value !== 'scroll' && hasBothScrollbarsVisible.value,
    )

    return {
      forwardRef,
      hasCorner,
    }
  },
  render() {
    return this.hasCorner
      ? h(
        ScrollAreaCornerImpl,
        mergeProps(this.$props, {
          ref: (el: any) => this.forwardRef(el),
        }),
        {
          default: () => this.$slots.default?.(),
        },
      )
      : null
  },
})
