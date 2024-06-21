import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerMenuSeparatorProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerMenuSeparatorProps = ExtractPublicPropTypes<typeof destylerMenuSeparatorProps>

export const DestylerMenuSeparator = defineComponent({
  name: 'DestylerMenuSeparator',
  props: destylerMenuSeparatorProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'role': 'separator',
      'aria-orientation': 'horizontal',
    }), () => this.$slots.default?.())
  },
})
