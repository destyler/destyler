import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const destylerDialogOverlayImplProps = {
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

export type DestylerDialogOverlayImplProps = ExtractPublicPropTypes<typeof destylerDialogOverlayImplProps>

export const DestylerDialogOverlayImpl = defineComponent({
  name: 'DestylerDialogOverlayImpl',
  props: destylerDialogOverlayImplProps,
  setup() {
    const rootContext = injectDialogRootContext()
    useForwardExpose()

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
    }, () => this.$slots.default?.())
  },
})
