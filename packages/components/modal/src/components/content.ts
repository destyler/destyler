import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, nextTick, ref, withModifiers } from 'vue'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { createContext } from '@destyler/shared'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DialogContent, dialogContentProps } from '@destyler/dialog'
import { dialogContentEmits } from '@destyler/dialog/component'

export const modalContentProps = {
  ...dialogContentProps,
} as const

export type ModalContentProps = ExtractPublicPropTypes<typeof modalContentProps>

export const modalContentEmits = {
  ...dialogContentEmits,
}

interface ModalContentContext {
  onCancelElementChange: (el: HTMLElement | undefined) => void
}

export const [injectModalContentContext, provideModalContentContext] = createContext<ModalContentContext>('ModalContent')

export const ModalContent = defineComponent({
  name: 'DestylerModalContent',
  props: modalContentProps,
  emits: modalContentEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    const cancelElement = ref<HTMLElement | undefined>()

    provideModalContentContext({
      onCancelElementChange: (el) => {
        cancelElement.value = el
      },
    })

    return {
      emitsAsProps,
      cancelElement,
    }
  },
  render() {
    return h(DialogContent, mergeProps(
      { ...this.$props, ...this.emitsAsProps },
      {
        role: 'modal',
        onPointerDownOutside: withModifiers(() => {}, ['prevent']),
        onInteractOutside: withModifiers(() => {}, ['prevent']),
        onOpenAutoFocus: () => {
          nextTick(() => {
            this.cancelElement?.focus({
              preventScroll: true,
            })
          })
        },
      },
    ), () => this.$slots.default?.())
  },
})
