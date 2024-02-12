import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalTriggerProps = {
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

export type DestylerModalTriggerProps = ExtractPublicPropTypes<typeof destylerModalTriggerProps>

export const DestylerModalTrigger = defineComponent({
  name: 'DestylerModalTrigger',
  props: destylerModalTriggerProps,
  setup() {
    const rootContext = injectModalRootContext()
    const { forwardRef, currentElement } = useForwardExpose()

    onMounted(() => {
      rootContext.triggerElement = currentElement
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': this.forwardRef,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'modal',
      'aria-expanded': this.rootContext.open.value || false,
      'aria-controls': this.rootContext.contentId,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onClick': () => {
        this.rootContext.onOpenToggle()
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
