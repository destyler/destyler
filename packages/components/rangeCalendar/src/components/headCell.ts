import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarHeadCellProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'th',
  },
} as const

export type RangeCalendarHeadCellProps = ExtractPublicPropTypes<typeof rangeCalendarHeadCellProps>

export const RangeCalendarHeadCell = defineComponent({
  name: 'DestylerRangeCalendarHeadCell',
  props: rangeCalendarHeadCellProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
