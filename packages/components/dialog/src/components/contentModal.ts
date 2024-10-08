import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps, useForwardExpose, useHideOthers } from '@destyler/composition'

import { injectDialogRootContext } from './root'
import { DialogContentImpl, dialogContentImplEmtis, dialogContentImplProps } from './contentImpl'

export const DialogContentModal = defineComponent({
  name: 'DestylerDialogContentModal',
  props: dialogContentImplProps,
  emits: dialogContentImplEmtis,
  setup(_, { emit }) {
    const rootContext = injectDialogRootContext()

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
    return h(DialogContentImpl, mergeProps(this.$props, this.emitsAsProps, {
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
