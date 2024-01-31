import type { Component, PropType } from 'vue'
import { defineComponent, h, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { DestylerPopperAnchor } from '@destyler/popper'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverTriggerProps = {
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

export type DestylerPopoverTriggerProps = ExtractPublicPropTypes<typeof destylerPopoverTriggerProps>

export const DestylerPopoverTrigger = defineComponent({
  name: 'DestylerPopoverTrigger',
  props: destylerPopoverTriggerProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    const { customElement, currentElement: triggerElement } = useCustomElement()

    onMounted(() => {
      rootContext.triggerElement.value = triggerElement.value
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
      'onClick': () => {
        this.rootContext.onOpenToggle()
      },
    }, this.$slots.default?.()))
  },
})
