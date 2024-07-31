import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectTooltipRootContext } from './root'
import { TooltipContentImpl, tooltipContentImplEmits, tooltipContentImplProps } from './contentImpl'
import { TooltipContentHoverable } from './contentHoverable'

export const tooltipContentProps = {
  ...tooltipContentImplProps,
} as const

export type TooltipContentProps = ExtractPublicPropTypes<typeof tooltipContentProps>

export const tooltipContentEmits = {
  ...tooltipContentImplEmits,
}

export const TooltipContent = defineComponent({
  name: 'DestylerTooltipContent',
  props: tooltipContentProps,
  emits: tooltipContentEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const rootContext = injectTooltipRootContext()
    const forwarded = useForwardPropsEmits(props, emit)
    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      forwarded,
      forwardRef,
    }
  },
  render() {
    if (this.rootContext.open.value) {
      return h(this.rootContext.disableHoverableContent.value ? TooltipContentImpl : TooltipContentHoverable, mergeProps(this.forwarded, {
        ref: this.forwardRef,
      }), () => this.$slots.default?.())
    }
  },
})
