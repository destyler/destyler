import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'
import { DialogContentModal } from './contentModal'
import { DialogContentNonModal } from './contentNonModal'
import { dialogContentImplEmtis, dialogContentImplProps } from './contentImpl'

export const dialogContentProps = {
  ...dialogContentImplProps,
} as const

export type DialogContentProps = ExtractPublicPropTypes<typeof dialogContentProps>

export const dialogContentEmits = {
  ...dialogContentImplEmtis,
}

export const DialogContent = defineComponent({
  name: 'DestylerDialogContent',
  props: dialogContentProps,
  emits: dialogContentEmits,
  setup(_, { emit }) {
    const rootContext = injectDialogRootContext()

    const emitsAsProps = useEmitAsProps(emit)

    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      emitsAsProps,
      forwardRef,
    }
  },
  render() {
    const useVShow = this.$props.forceMount || this.rootContext.modal.value
    return h(Presence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => [
      useVShow
        ? h(DialogContentModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          onOpenAutoFocus: (event: any) => {
            this.$emit('openAutoFocus', event)
          },
        }), () => this.$slots.default?.())
        : h(DialogContentNonModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
        }), () => this.$slots.default?.()),
    ])
  },
})
