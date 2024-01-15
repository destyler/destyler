import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { injectCollapsibleRootContext } from './collapsibleRoot'

export const destylerCollapsibleTriggerProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

export const DestylerCollapsibleTrigger = defineComponent({
  name: 'DestylerCollapsibleTrigger',
  props: destylerCollapsibleTriggerProps,
  setup() {
    const rootContext = injectCollapsibleRootContext()

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
    }, this.$slots.default?.())
  },
})
