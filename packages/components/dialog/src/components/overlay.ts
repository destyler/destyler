import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'
import { DialogOverlayImpl } from './overlayImpl'

export const dialogOverlayProps = {
  ...primitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DialogOverlayProps = ExtractPublicPropTypes<typeof dialogOverlayProps>

export const DialogOverlay = defineComponent({
  name: 'DestylerDialogOverlay',
  props: dialogOverlayProps,

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
      ? h(Presence, {
        present: this.$props.forceMount || this.rootContext.open.value,
      }, () => h(DialogOverlayImpl, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), () => this.$slots.default?.()))
      : null
  },
})
