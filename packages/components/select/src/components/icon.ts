import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const selectIconProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SelectIconProps = ExtractPublicPropTypes<typeof selectIconProps>

export const SelectIcon = defineComponent({
  name: 'DestylerSelectIcon',
  props: selectIconProps,

  render() {
    return h(Primitive, {
      'aria-hidden': '',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, () => this.$slots.default ? this.$slots.default?.() : '▼')
  },
})
