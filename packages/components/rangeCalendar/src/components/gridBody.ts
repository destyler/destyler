import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarGridBodyProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'tbody',
  },
} as const

export type RangeCalendarGridBodyProps = ExtractPublicPropTypes<typeof rangeCalendarGridBodyProps>

export const RangeCalendarGridBody = defineComponent({
  name: 'DestylerRangeCalendarGridBody',
  props: rangeCalendarGridBodyProps,
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
