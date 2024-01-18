import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { injectDialogRootContext } from './dialogRoot'
import { destylerDialogContentImplProps } from './dialogContentImpl'
import { DestylerDialogContentModal } from './dialogContentModal'
import { DestylerDialogContentNonModal } from './dialogContentNonModal'

export const destylerDialogContentProps = {
  ...destylerDialogContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
}

export const DestylerDialogContent = defineComponent({
  name: 'DestylerDialogContent',
  props: destylerDialogContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(_, { emit }) {
    const rootContext = injectDialogRootContext()

    const emitsAsProps = useEmitAsProps(emit)

    return {
      rootContext,
      emitsAsProps,
    }
  },
  render() {
    const useVShow = this.rootContext.modal.value
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, [
      useVShow
        ? h(DestylerDialogContentModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs, {
          onOpenAutoFocus: (event: any) => {
            this.$emit('openAutoFocus', event)
          },
        }), this.$slots.default?.())
        : h(DestylerDialogContentNonModal, mergeProps(this.$props, this.emitsAsProps, this.$attrs), this.$slots.default?.()),
    ])
  },
})
