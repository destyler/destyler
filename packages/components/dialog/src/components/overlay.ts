import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'
import { DestylerDialogOverlayImpl } from './overlayImpl'

export const destylerDialogOverlayProps = {
  ...destylerPrimitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDialogOverlayProps = ExtractPublicPropTypes<typeof destylerDialogOverlayProps>

export const DestylerDialogOverlay = defineComponent({
  name: 'DestylerDialogOverlay',
  props: destylerDialogOverlayProps,
  setup() {
    const rootContext = injectDialogRootContext()

    const { forwardRef } = useForwardExpose()
    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    const useVShow = this.rootContext?.modal.value
    return useVShow
      ? h(DestylerPresence, {
        present: this.$props.forceMount || this.rootContext.open.value,
      }, () => h(DestylerDialogOverlayImpl, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), () => this.$slots.default?.()))
      : null
  },
})
