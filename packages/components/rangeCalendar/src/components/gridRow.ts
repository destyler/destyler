import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarGridRowProps = {
  ...primitiveProps,
  /**
   * @default tr
   */
  as: {
    ...primitiveProps.as,
    default: 'tr',
  },
} as const

export type RangeCalendarGridRowProps = ExtractPublicPropTypes<typeof rangeCalendarGridRowProps>

export const RangeCalendarGridRow = defineComponent({
  name: 'DestylerRangeCalendarGridRow',
  props: rangeCalendarGridRowProps,
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
