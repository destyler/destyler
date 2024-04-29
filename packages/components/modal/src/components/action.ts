import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { DestylerModalCancel, destylerModalCancelProps } from './cancel'

export const destylerModalActionProps = {
  ...destylerModalCancelProps,
} as const

export type DestylerModalActionProps = ExtractPublicPropTypes<typeof destylerModalActionProps>

export const DestylerModalAction = defineComponent({
  name: 'DestylerModalAction',
  props: destylerModalActionProps,
  render() {
    return h(DestylerModalCancel, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
