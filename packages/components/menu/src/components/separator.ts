import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const menuSeparatorProps = {
  ...primitiveProps,
} as const

export type MenuSeparatorProps = ExtractPublicPropTypes<typeof menuSeparatorProps>

export const MenuSeparator = defineComponent({
  name: 'DestylerMenuSeparator',
  props: menuSeparatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'role': 'separator',
      'aria-orientation': 'horizontal',
    }), () => this.$slots.default?.())
  },
})
