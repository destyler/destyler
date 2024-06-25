import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerToastTitleProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerToastTitleProps = ExtractPublicPropTypes<typeof destylerToastTitleProps>

export const DestylerToastTitle = defineComponent({
  name: 'DestylerToastTitle',
  props: destylerToastTitleProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.())
  },
})
