import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { excludeTouch } from '../utils'
import { DestylerHoverCardContentImpl, destylerHoverCardContentImplProps } from './contentImpl'
import { injectHoverCardRootContext } from './root'

export const destylerHoverCardContentProps = {
  ...destylerHoverCardContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerHoverCardContentProps = ExtractPublicPropTypes<typeof destylerHoverCardContentProps>

export const DestylerHoverCardContent = defineComponent({
  name: 'DestylerHoverCardContent',
  props: destylerHoverCardContentProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
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
    return h(DestylerPresence, {
      present: this.forceMount || this.rootContext.open.value,
    }, () => h(DestylerHoverCardContentImpl, mergeProps(this.forwarded, {
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
