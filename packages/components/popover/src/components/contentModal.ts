import { defineComponent, h, mergeProps, ref } from 'vue'
import { useForwardExpose, useForwardPropsEmits, useHideOthers } from '@destyler/composition'

import { DestylerPopoverContentImpl, destylerPopoverContentImplEmits, destylerPopoverContentImplProps } from './contentImpl'
import { injectPopoverRootContext } from './root'

export const DestylerPopoverContentModal = defineComponent({
  name: 'DestylerPopoverContentModal',
  props: destylerPopoverContentImplProps,
  emits: destylerPopoverContentImplEmits,
  setup(props, { emit }) {
    const rootContext = injectPopoverRootContext()
    const isRightClickOutsideRef = ref(false)
    const forwarded = useForwardPropsEmits(props, emit)

    const { forwardRef, currentElement } = useForwardExpose()

    useHideOthers(currentElement)

    return {
      rootContext,
      forwarded,
      isRightClickOutsideRef,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPopoverContentImpl, {
      ref: (el: any) => this.forwardRef(el),
      ...mergeProps(this.forwarded),
      trapFocus: this.rootContext.open.value,
      disableOutsidePointerEvents: true,
      onCloseAutoFocusPrevent: (event: any) => {
        this.$emit('closeAutoFocus', event)

        if (!this.isRightClickOutsideRef)
          this.rootContext.triggerElement.value?.focus()
      },
      onPointerDownOutside: (event: any) => {
        this.$emit('pointerDownOutside', event)

        const originalEvent = event.detail.originalEvent
        const ctrlLeftClick
          = originalEvent.button === 0 && originalEvent.ctrlKey === true
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick

        this.isRightClickOutsideRef = isRightClick
      },
    }, () => this.$slots.default?.())
  },
})
