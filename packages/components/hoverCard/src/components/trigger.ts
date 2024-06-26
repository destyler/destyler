import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperAnchor } from '@destyler/popper'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

import { excludeTouch } from '../utils'
import { injectHoverCardRootContext } from './root'

export const destylerHoverCardTriggerProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'a',
  },
} as const

export type DestylerHoverCardTriggerProps = ExtractPublicPropTypes<typeof destylerHoverCardTriggerProps>

export const DestylerHoverCardTrigger = defineComponent({
  name: 'DestylerHoverCardTrigger',
  props: destylerHoverCardTriggerProps,
  setup() {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPopperAnchor, {
      asChild: true,
    }, () => h(DestylerPrimitive, {
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
