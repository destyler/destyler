import { defineComponent, h, mergeProps, SlotsType, VNode } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarGridRowProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'tr',
  },
} as const

export type RangeCalendarGridRowProps = ExtractPublicPropTypes<typeof rangeCalendarGridRowProps>

export const RangeCalendarGridRow = defineComponent({
  name: 'DestylerRangeCalendarGridRow',
  props: rangeCalendarGridRowProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
