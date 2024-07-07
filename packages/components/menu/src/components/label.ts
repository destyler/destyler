import type { SlotsType, VNode } from 'vue'
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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(Primitive, this.$props, () => this.$slots.default?.())
  },
})
