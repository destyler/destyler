import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'

export const destylerDialogTriggerProps = {
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

export type DestylerDialogTriggerProps = ExtractPublicPropTypes<typeof destylerDialogTriggerProps>

export const DestylerDialogTrigger = defineComponent({
  name: 'DestylerDialogTrigger',
  props: destylerDialogTriggerProps,
  setup() {
    const rootContext = injectDialogRootContext()
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
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'ref': 'customElement',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'dialog',
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
