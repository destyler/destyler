import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectCollapsibleRootContext } from './root'

export const destylerCollapsibleTriggerProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
} as const

export type DestylerCollapsibleTriggerProps = ExtractPublicPropTypes<typeof destylerCollapsibleTriggerProps>

export const DestylerCollapsibleTrigger = defineComponent({
  name: 'DestylerCollapsibleTrigger',
  props: destylerCollapsibleTriggerProps,
  setup() {
    const rootContext = injectCollapsibleRootContext()

    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-controls': this.rootContext.contentId,
      'aria-expanded': this.rootContext.open.value,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'data-disabled': this.rootContext.disabled?.value ? '' : undefined,
      'disabled': this.rootContext.disabled?.value,
      'onClick': this.rootContext.onOpenToggle,
    }, () => this.$slots.default?.())
  },
})
