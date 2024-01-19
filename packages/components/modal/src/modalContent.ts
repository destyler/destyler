import { defineComponent, h, nextTick, ref } from 'vue'
import { createContext } from '@destyler/shared'
import { DestylerDialogContent, destylerDialogContentProps } from '@destyler/dialog'
import { useEmitAsProps } from '@destyler/composition'

export interface ModalContentContext {
  onCancelElementChange(el: HTMLElement | undefined): void
}

export const [injectAlertDialogContentContext, provideAlertDialogContentContext] = createContext<ModalContentContext>('ModalContent')

export const destylerModalContentProps = {
  ...destylerDialogContentProps,
}

export const DestylerModalContent = defineComponent({
  name: 'DestylerModalContent',
  props: destylerModalContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)

    const cancelElement = ref<HTMLElement | undefined>()

    provideAlertDialogContentContext({
      onCancelElementChange: (el) => {
        cancelElement.value = el
      },
    })

    return {
      cancelElement,
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerDialogContent, {
      role: 'modal',
      onOpenAutoFocus: () => {
        nextTick(() => {
          this.cancelElement?.focus({
            preventScroll: true,
          })
        })
      },
    }, this.$slots.default?.())
  },
})
