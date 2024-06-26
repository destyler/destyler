import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerSelectIconProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerSelectIconProps = ExtractPublicPropTypes<typeof destylerSelectIconProps>

export const DestylerSelectIcon = defineComponent({
  name: 'DestylerSelectIcon',
  props: destylerSelectIconProps,
  render() {
    return h(DestylerPrimitive, {
      'aria-hidden': '',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, () => this.$slots.default ? this.$slots.default?.() : '▼')
  },
})
