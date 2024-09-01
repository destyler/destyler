import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const toastTitleProps = {
  ...primitiveProps,
} as const

export type ToastTitleProps = ExtractPublicPropTypes<typeof toastTitleProps>

export const ToastTitle = defineComponent({
  name: 'DestylerToastTitle',
  props: toastTitleProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.())
  },
})
