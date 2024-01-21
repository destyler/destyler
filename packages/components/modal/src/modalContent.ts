import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { injectModalRootContext } from './modalRoot'
import { destylerModalContentImplProps } from './modalContentImpl'
import { DestylerModalContentModal } from './modalContentModal'

export const destylerModalContentProps = {
  ...destylerModalContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
}

export const DestylerModalContent = defineComponent({
  name: 'DestylerModalContent',
  props: destylerModalContentProps,
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
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, h(DestylerModalContentModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
      onOpenAutoFocus: (event: any) => {
        this.$emit('openAutoFocus', event)
      },
    }), this.$slots.default?.()))
  },
})
