import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const menuGroupProps = {
  ...primitiveProps,
} as const

export type MenuGroupProps = ExtractPublicPropTypes<typeof menuGroupProps>

export const MenuGroup = defineComponent({
  name: 'DestylerMenuGroup',
  props: menuGroupProps,
  render() {
    return h(Primitive, mergeProps(this.$props, {
      role: 'group',
    }), () => this.$slots.default?.())
  },
})
