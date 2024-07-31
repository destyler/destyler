import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DialogTitle, dialogTitleProps } from '@destyler/dialog'

export const modalTitleProps = {
  ...dialogTitleProps,
} as const

export type ModalTitleProps = ExtractPublicPropTypes<typeof modalTitleProps>

export const ModalTitle = defineComponent({
  name: 'DestylerModalTitle',
  props: modalTitleProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DialogTitle, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
