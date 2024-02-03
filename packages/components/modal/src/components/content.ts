import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'
import { destylerModalContentImplProps } from './contentImpl'
import { DestylerModalContentModal } from './contentModal'

export const destylerModalContentProps = {
  ...destylerModalContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerModalContentProps = ExtractPublicPropTypes<typeof destylerModalContentProps>

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
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
