import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarGridHeadProps = {
  ...primitiveProps,
  /**
   * @default thead
   */
  as: {
    ...primitiveProps.as,
    default: 'thead',
  },
} as const

export type RangeCalendarGridHeadProps = ExtractPublicPropTypes<typeof rangeCalendarGridHeadProps>

export const RangeCalendarGridHead = defineComponent({
  name: 'DestylerRangeCalendarGridHead',
  props: rangeCalendarGridHeadProps,
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-hidden': true,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
