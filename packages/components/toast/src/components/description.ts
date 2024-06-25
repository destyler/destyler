import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerToastDescriptionProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerToastDescriptionProps = ExtractPublicPropTypes<typeof destylerToastDescriptionProps>

export const DestylerToastDescription = defineComponent({
  name: 'DestylerToastDescription',
  props: destylerToastDescriptionProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.())
  },
})
