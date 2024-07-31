import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DialogDescription, dialogDescriptionProps } from '@destyler/dialog'
import { useForwardExpose } from '@destyler/composition'

export const modalDescriptionProps = {
  ...dialogDescriptionProps,
} as const

export type ModalDescriptionProps = ExtractPublicPropTypes<typeof modalDescriptionProps>

export const ModalDescription = defineComponent({
  name: 'DestylerModalDescription',
  props: modalDescriptionProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DialogDescription, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
