import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DialogClose, dialogCloseProps } from '@destyler/dialog'

export const modalActionProps = {
  ...dialogCloseProps,
} as const

export type ModalActionProps = ExtractPublicPropTypes<typeof modalActionProps>

export const ModalAction = defineComponent({
  name: 'DestylerModalAction',
  props: modalActionProps,
  render() {
    return h(DialogClose, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
