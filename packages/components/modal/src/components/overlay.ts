import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'
import { ModalOverlayImpl } from './overlayImpl'

export const modalOverlayProps = {
  ...primitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ModalOverlayProps = ExtractPublicPropTypes<typeof modalOverlayProps>

export const ModalOverlay = defineComponent({
  name: 'DestylerModalOverlay',
  props: modalOverlayProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => h(ModalOverlayImpl, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }), () => this.$slots.default?.()))
  },
})
