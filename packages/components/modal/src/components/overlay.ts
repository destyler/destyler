import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'
import { DestylerModalOverlayImpl } from './overlayImpl'

export const destylerModalOverlayProps = {
  ...destylerPrimitiveProps,
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
    }, () => h(DestylerModalOverlayImpl, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }), () => this.$slots.default?.()))
  },
})
