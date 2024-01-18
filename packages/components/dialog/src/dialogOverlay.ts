import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'

import { injectDialogRootContext } from './dialogRoot'
import { DestylerDialogOverlayImpl } from './dialogOverlayImpl'

export const destylerDialogOverlayProps = {
  ...destylerPrimitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
}

export const DestylerDialogOverlay = defineComponent({
  name: 'DestylerDialogOverlay',
  props: destylerDialogOverlayProps,
  setup() {
    const rootContext = injectDialogRootContext()

    return {
      rootContext,
    }
  },
  render() {
    const useVShow = this.rootContext?.modal.value
    return useVShow
      ? h(DestylerPresence, {
        present: this.$props.forceMount || this.rootContext.open.value,
      }, h(DestylerDialogOverlayImpl, mergeProps(this.$attrs, {
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), this.$slots.default?.()))
      : null
  },
})
