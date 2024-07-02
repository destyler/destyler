import { defineComponent, h, mergeProps, ref } from 'vue'
import { useEmitAsProps } from '@destyler/composition'

import { injectDialogRootContext } from './root'
import { DialogContentImpl, dialogContentImplProps } from './contentImpl'

export const DialogContentNonModal = defineComponent({
  name: 'DestylerDialogContentNonModal',
  props: dialogContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(_, { emit }) {
    const rootContext = injectDialogRootContext()
    const hasInteractedOutsideRef = ref(false)
    const hasPointerDownOutsideRef = ref(false)

    const emitsAsProps = useEmitAsProps(emit)
    return {
      rootContext,
      hasInteractedOutsideRef,
      hasPointerDownOutsideRef,
      emitsAsProps,
    }
  },
  render() {
    return h(DialogContentImpl, mergeProps(this.$props, this.emitsAsProps, {
      'trap-focus': false,
      'disableOutsidePointerEvents': false,
      'onCloseAutoFocus': (event: any) => {
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
      'onInteractOutside': (event: any) => {
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
    }), () => this.$slots.default?.())
  },
})
