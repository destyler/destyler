import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'

import { injectModalRootContext } from './modalRoot'
import { DestylerModalOverlayImpl } from './modalOverlayImpl'

export const destylerModalOverlayProps = {
  ...destylerPrimitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
}

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
