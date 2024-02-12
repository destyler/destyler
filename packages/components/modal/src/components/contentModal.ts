import { defineComponent, h, mergeProps } from 'vue'
import { useEmitAsProps, useForwardExpose, useHideOthers } from '@destyler/composition'

import { injectModalRootContext } from './root'
import { DestylerModalContentImpl, destylerModalContentImplProps } from './contentImpl'

export const DestylerModalContentModal = defineComponent({
  name: 'DestylerModalContentModal',
  props: destylerModalContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
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
    return h(DestylerModalContentImpl, mergeProps(this.$props, this.emitsAsProps, {
      'ref': this.forwardRef,
      'trap-focus': this.rootContext.open.value,
      'disable-outside-pointer-events': true,
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
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
