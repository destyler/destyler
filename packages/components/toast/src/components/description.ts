import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const toastDescriptionProps = {
  ...primitiveProps,
} as const

export type ToastDescriptionProps = ExtractPublicPropTypes<typeof toastDescriptionProps>

export const ToastDescription = defineComponent({
  name: 'DestylerToastDescription',
  props: toastDescriptionProps,

  setup() {
    useForwardExpose()
  },
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.())
  },
})
