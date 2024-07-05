import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'
import { modalContentImplProps } from './contentImpl'
import { ModalContentModal } from './contentModal'

export const modalContentProps = {
  ...modalContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ModalContentProps = ExtractPublicPropTypes<typeof modalContentProps>

export const ModalContent = defineComponent({
  name: 'DestylerModalContent',
  props: modalContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(_, { emit }) {
    const rootContext = injectModalRootContext()

    const emitsAsProps = useEmitAsProps(emit)

    return {
      rootContext,
      emitsAsProps,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => h(ModalContentModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
      onOpenAutoFocus: (event: any) => {
        this.$emit('openAutoFocus', event)
      },
    }), () => this.$slots.default?.()))
  },
})
