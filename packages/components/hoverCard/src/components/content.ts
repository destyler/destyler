import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { excludeTouch } from '../utils'
import { HoverCardContentImpl, hoverCardContentImplEmits, hoverCardContentImplProps } from './contentImpl'
import { injectHoverCardRootContext } from './root'

export const hoverCardContentProps = {
  ...hoverCardContentImplProps,
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type HoverCardContentProps = ExtractPublicPropTypes<typeof hoverCardContentProps>

export const hoverCardContentEmits = {
  ...hoverCardContentImplEmits,
}

export const HoverCardContent = defineComponent({
  name: 'DestylerHoverCardContent',
  props: hoverCardContentProps,
  emits: hoverCardContentEmits,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    const { forwardRef } = useForwardExpose()

    const rootContext = injectHoverCardRootContext()

    return {
      rootContext,
      forwarded,
      forwardRef,
    }
  },
  render() {
    return h(Presence, {
      present: this.forceMount || this.rootContext.open.value,
    }, () => h(HoverCardContentImpl, mergeProps(this.forwarded, {
      ref: (el: any) => this.forwardRef(el),
      onPointerenter: (event: any) => {
        excludeTouch(this.rootContext.onOpen)(event)
      },
      onPointerleave: (event: any) => {
        excludeTouch(this.rootContext.onClose)(event)
      },
    }), () => this.$slots.default?.()))
  },
})
