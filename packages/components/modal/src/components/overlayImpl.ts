import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalOverlayImplProps = {
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
} as const

export type DestylerModalOverlayImplProps = ExtractPublicPropTypes<typeof destylerModalOverlayImplProps>

export const DestylerModalOverlayImpl = defineComponent({
  name: 'DestylerModalOverlayImpl',
  props: destylerModalOverlayImplProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'style': {
        'pointer-events': 'auto',
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
