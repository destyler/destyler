import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerMenuLabelProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerMenuLabelProps = ExtractPublicPropTypes<typeof destylerMenuLabelProps>

export const DestylerMenuLabel = defineComponent({
  name: 'DestylerMenuLabel',
  props: destylerMenuLabelProps,
  render() {
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.())
  },
})
