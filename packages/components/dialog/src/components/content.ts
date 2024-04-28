import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'
import { DestylerDialogContentModal } from './contentModal'
import { DestylerDialogContentNonModal } from './contentNonModal'

export const destylerDialogContentProps = {
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
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDialogContentProps = ExtractPublicPropTypes<typeof destylerDialogContentProps>

export const DestylerDialogContent = defineComponent({
  name: 'DestylerDialogContent',
  props: destylerDialogContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
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
    const useVShow = this.rootContext.modal.value
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => [
      useVShow
        ? h(DestylerDialogContentModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          onOpenAutoFocus: (event: any) => {
            this.$emit('openAutoFocus', event)
          },
        }), () => this.$slots.default?.())
        : h(DestylerDialogContentNonModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, { ref: (el: any) => this.forwardRef(el) }), () => this.$slots.default?.()),
    ])
  },
})
