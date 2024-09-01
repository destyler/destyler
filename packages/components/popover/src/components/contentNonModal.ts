import { defineComponent, h, ref } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'

import { PopoverContentImpl, popoverContentImplEmits, popoverContentImplProps } from './contentImpl'
import { injectPopoverRootContext } from './root'

export const PopoverContentNonModal = defineComponent({
  name: 'DestylerPopoverContentNonModal',
  props: popoverContentImplProps,
  emits: popoverContentImplEmits,
  setup(props, { emit }) {
    const rootContext = injectPopoverRootContext()
    const hasInteractedOutsideRef = ref(false)
    const hasPointerDownOutsideRef = ref(false)
    const forwarded = useForwardPropsEmits(props, emit)

    return {
      forwarded,
      rootContext,
      hasInteractedOutsideRef,
      hasPointerDownOutsideRef,
    }
  },
  render() {
    return h(PopoverContentImpl, {
      ...this.forwarded,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      onCloseAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
        if (!event.defaultPrevented) {
          if (!this.hasInteractedOutsideRef)
            this.rootContext.triggerElement.value?.focus()
          // Always prevent auto focus because we either focus manually or want user agent focus
          event.preventDefault()
        }

        this.hasInteractedOutsideRef = false
        this.hasPointerDownOutsideRef = false
      },
      onInteractOutside: async (event) => {
        this.$emit('interactOutside', event)

        if (!event.defaultPrevented) {
          this.hasInteractedOutsideRef = true
          if (event.detail.originalEvent.type === 'pointerdown')
            this.hasPointerDownOutsideRef = true
        }

        const target = event.target as HTMLElement
        const targetIsTrigger = this.rootContext.triggerElement.value?.contains(target)
        if (targetIsTrigger)
          event.preventDefault()

        if (event.detail.originalEvent.type === 'focusin' && this.hasPointerDownOutsideRef)
          event.preventDefault()
      },
    }, () => this.$slots.default?.())
  },
})
