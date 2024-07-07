import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
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

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    const useVShow = this.rootContext.open.value
    return useVShow
      ? h(this.rootContext.disableHoverableContent.value ? TooltipContentImpl : TooltipContentHoverable, {
        ...this.forwarded,
      }, () => this.$slots.default?.())
      : null
  },
})
