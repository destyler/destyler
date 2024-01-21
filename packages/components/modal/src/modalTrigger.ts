import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

import { injectModalRootContext } from './modalRoot'

export const destylerModalTriggerProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

export const DestylerModalTrigger = defineComponent({
  name: 'DestylerModalTrigger',
  props: destylerModalTriggerProps,
  setup() {
    const rootContext = injectModalRootContext()
    const { customElement, currentElement } = useCustomElement()

    onMounted(() => {
      rootContext.triggerElement = currentElement
    })

    return {
      rootContext,
      customElement,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': 'customElement',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'modal',
      'aria-expanded': this.rootContext.open.value || false,
      'aria-controls': this.rootContext.contentId,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onClick': () => {
        this.rootContext.onOpenToggle()
      },
    }), this.$slots.default?.())
  },
})
