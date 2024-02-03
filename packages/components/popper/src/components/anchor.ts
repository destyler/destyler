import type { Component, PropType } from 'vue'
import { defineComponent, h, watch } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes, Measurable } from '@destyler/shared'

import { injectPopperRootContext } from './root'

export const destylerPopperAnchorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  element: {
    type: Object as PropType<Measurable>,
  },
} as const

export type DestylerPopperAnchorProps = ExtractPublicPropTypes<typeof destylerPopperAnchorProps>

export const DestylerPopperAnchor = defineComponent({
  name: 'DestylerPopperAnchor',
  props: destylerPopperAnchorProps,
  setup(props) {
    const { customElement, currentElement } = useCustomElement()

    const rootContext = injectPopperRootContext()

    watch(currentElement, () => {
      rootContext.onAnchorChange(props.element ?? currentElement.value)
    })

    return {
      customElement,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: 'customElement',
    }, this.$slots.default?.())
  },
})
