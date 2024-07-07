import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps, useForwardExpose, useHideOthers } from '@destyler/composition'

import { injectModalRootContext } from './root'
import { ModalContentImpl, modalContentImplEmits, modalContentImplProps } from './contentImpl'

export const ModalContentModal = defineComponent({
  name: 'DestylerModalContentModal',
  props: modalContentImplProps,
  emits: modalContentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const rootContext = injectModalRootContext()

    const emitsAsProps = useEmitAsProps(emit)

    const { forwardRef, currentElement } = useForwardExpose()

    useHideOthers(currentElement)

    return {
      rootContext,
      emitsAsProps,
      forwardRef,
    }
  },
  render() {
    return h(ModalContentImpl, mergeProps(this.$props, this.emitsAsProps, {
      'ref': (el: any) => this.forwardRef(el),
      'trap-focus': this.rootContext.open.value,
      'disableOutsidePointerEvents': true,
      'onCloseAutoFocus': (event: any) => {
        this.$emit('closeAutoFocus', event)

        if (!event.defaultPrevented) {
          event.preventDefault()
          this.rootContext.triggerElement.value?.focus()
        }
      },
      'onPointerDownOutside': (event: any) => {
        const originalEvent = event.detail.originalEvent
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick

        if (isRightClick)
          event.preventDefault()
      },
      'onFocusOutside': (event: any) => {
        event.preventDefault()
      },
      'onOpenAutoFocus': (event: any) => {
        this.$emit('openAutoFocus', event)
      },
    }), () => this.$slots.default?.())
  },
})
