import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { ModalCancel, modalCancelProps } from './cancel'

export const modalActionProps = {
  ...modalCancelProps,
} as const

export type ModalActionProps = ExtractPublicPropTypes<typeof modalActionProps>

export const ModalAction = defineComponent({
  name: 'DestylerModalAction',
  props: modalActionProps,
  render() {
    return h(ModalCancel, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
