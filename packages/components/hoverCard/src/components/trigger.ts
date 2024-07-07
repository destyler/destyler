import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperAnchor } from '@destyler/popper'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { excludeTouch } from '../utils'
import { injectHoverCardRootContext } from './root'

export const hoverCardTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'a',
  },
} as const

export type HoverCardTriggerProps = ExtractPublicPropTypes<typeof hoverCardTriggerProps>

export const HoverCardTrigger = defineComponent({
  name: 'DestylerHoverCardTrigger',
  props: hoverCardTriggerProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(PopperAnchor, {
      asChild: true,
    }, () => h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onPointerenter': (event: any) => {
        excludeTouch(this.rootContext.onOpen)(event)
      },
      'onPointerleave': (event: any) => {
        excludeTouch(this.rootContext.onClose)(event)
      },
      'onFocus': () => {
        this.rootContext.onOpen()
      },
      'onBlur': () => {
        this.rootContext.onClose()
      },
    }, () => this.$slots.default?.()))
  },
})
