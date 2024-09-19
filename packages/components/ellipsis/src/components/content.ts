import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { TooltipContent, tooltipContentProps } from '@destyler/tooltip'
import { tooltipContentEmits } from '@destyler/tooltip/component'

import { injectEllipsisRootContext } from './root'

export const ellipsisContentProps = {
  ...tooltipContentProps,
} as const

export type EllipsisContentProps = ExtractPublicPropTypes<typeof ellipsisContentProps>

export const ellipsisContentEmits = {
  ...tooltipContentEmits,
}

export const EllipsisContent = defineComponent({
  name: 'DestylerEllipsisContent',
  props: ellipsisContentProps,
  emits: ellipsisContentEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * The text to be item
       */
      text: string
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const rootContext = injectEllipsisRootContext()
    const forwarded = useForwardPropsEmits(props, emit)
    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      forwarded,
      forwardRef,
    }
  },
  render() {
    return h(TooltipContent, mergeProps(this.forwarded, {
      ref: this.forwardRef,
    }), () => this.$slots.default ? this.$slots.default?.({ text: this.rootContext.text.value }) : this.rootContext.text.value)
  },
})
