import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectSeparatorProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerSelectSeparatorProps = ExtractPublicPropTypes<typeof destylerSelectSeparatorProps>

export const DestylerSelectSeparator = defineComponent({
  name: 'DestylerSelectSeparator',
  props: destylerSelectSeparatorProps,
  render() {
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.())
  },
})
