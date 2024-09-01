import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DialogOverlay, dialogOverlayProps } from '@destyler/dialog'

export const modalOverlayProps = {
  ...dialogOverlayProps,
} as const

export type ModalOverlayProps = ExtractPublicPropTypes<typeof modalOverlayProps>

export const ModalOverlay = defineComponent({
  name: 'DestylerModalOverlay',
  props: modalOverlayProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DialogOverlay, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
