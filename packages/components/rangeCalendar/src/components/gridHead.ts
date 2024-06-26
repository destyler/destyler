import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarGridHeadProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'thead',
  },
} as const

export type DestylerRangeCalendarGridHeadProps = ExtractPublicPropTypes<typeof destylerRangeCalendarGridHeadProps>

export const DestylerRangeCalendarGridHead = defineComponent({
  name: 'DestylerRangeCalendarGridHead',
  props: destylerRangeCalendarGridHeadProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-hidden': true,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
