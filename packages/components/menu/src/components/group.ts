import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerMenuGroupProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerMenuGroupProps = ExtractPublicPropTypes<typeof destylerMenuGroupProps>

export const DestylerMenuGroup = defineComponent({
  name: 'DestylerMenuGroup',
  props: destylerMenuGroupProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      role: 'group',
    }), () => this.$slots.default?.())
  },
})
