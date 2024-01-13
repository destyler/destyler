import type { Component, PropType } from 'vue'
import { defineComponent, h, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { DestylerPopperAnchor } from '@destyler/popper'
import { useCustomElement } from '@destyler/composition'
import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverTriggerProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

export const DestylerPopoverTrigger = defineComponent({
  name: 'DestylerPopoverTrigger',
  props: destylerPopoverTriggerProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    const { customElement, currentElement: triggerElement } = useCustomElement()

    onMounted(() => {
      rootContext.triggerElement.value = triggerElement.value
      rootContext.open.value = true
    })

    return {
      rootContext,
      customElement,
    }
  },
  render() {
    return h(this.rootContext.hasCustomAnchor.value ? DestylerPrimitive : DestylerPopperAnchor, {
      asChild: true,
    }, h(DestylerPrimitive, {
      'ref': 'customElement',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'as': this.$props.as,
      'aria-haspopup': 'dialog',
      'asChild': this.$props.asChild,
      'aria-expanded': this.rootContext.open.value,
      'aria-controls': this.rootContext.contentId,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onClick': this.rootContext.onOpenToggle,
    }, this.$slots.default?.()))
  },
})
