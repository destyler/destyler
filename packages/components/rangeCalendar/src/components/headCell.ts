import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarHeadCellProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'th',
  },
} as const

export type DestylerRangeCalendarHeadCellProps = ExtractPublicPropTypes<typeof destylerRangeCalendarHeadCellProps>

export const DestylerRangeCalendarHeadCell = defineComponent({
  name: 'DestylerRangeCalendarHeadCell',
  props: destylerRangeCalendarHeadCellProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
