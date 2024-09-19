import { defineComponent, h, mergeProps } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DialogTrigger } from '@destyler/dialog'

export const modalTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type ModalTriggerProps = ExtractPublicPropTypes<typeof modalTriggerProps>

export const ModalTrigger = defineComponent({
  name: 'DestylerModalTrigger',
  props: modalTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DialogTrigger, mergeProps(this.$props), () => this.$slots.default?.())
  },
})
