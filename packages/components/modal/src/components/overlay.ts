import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'
import { DestylerModalOverlayImpl } from './overlayImpl'

export const destylerModalOverlayProps = {
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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerModalOverlayProps = ExtractPublicPropTypes<typeof destylerModalOverlayProps>

export const DestylerModalOverlay = defineComponent({
  name: 'DestylerModalOverlay',
  props: destylerModalOverlayProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, h(DestylerModalOverlayImpl, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }), this.$slots.default?.()))
  },
})
