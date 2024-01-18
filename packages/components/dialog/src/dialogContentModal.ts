import { defineComponent, h, mergeProps } from 'vue'
import { useCustomElement, useEmitAsProps, useHideOthers } from '@destyler/composition'

import { injectDialogRootContext } from './dialogRoot'
import { DestylerDialogContentImpl, destylerDialogContentImplProps } from './dialogContentImpl'

export const DestylerDialogContentModal = defineComponent({
  name: 'DestylerDialogContentModal',
  props: destylerDialogContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(_, { emit }) {
    const rootContext = injectDialogRootContext()

    const emitsAsProps = useEmitAsProps(emit)

    const { customElement, currentElement } = useCustomElement()

    useHideOthers(currentElement)

    return {
      rootContext,
      emitsAsProps,
      customElement,
    }
  },
  render() {
    return h(DestylerDialogContentImpl, mergeProps(this.$props, this.emitsAsProps, {
      'ref': 'customElement',
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
    }), this.$slots.default?.())
  },
})
