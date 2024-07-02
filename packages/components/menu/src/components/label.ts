import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const menuLabelProps = {
  ...primitiveProps,
} as const

export type MenuLabelProps = ExtractPublicPropTypes<typeof menuLabelProps>

export const MenuLabel = defineComponent({
  name: 'DestylerMenuLabel',
  props: menuLabelProps,
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.())
  },
})
