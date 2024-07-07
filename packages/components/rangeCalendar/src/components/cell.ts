import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DateValue } from '@internationalized/date'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarCellProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'td',
  },
  date: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type RangeCalendarCellProps = ExtractPublicPropTypes<typeof rangeCalendarCellProps>

export const RangeCalendarCell = defineComponent({
  name: 'DestylerRangeCalendarCell',
  props: rangeCalendarCellProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'role': 'gridcell',
      'aria-selected': this.rootContext.isSelected(this.$props.date) ? true : undefined,
      'aria-disabled': this.rootContext.isDateDisabled(this.$props.date) || this.rootContext.isDateUnavailable?.(this.$props.date),
      'data-disabled': this.rootContext.isDateDisabled(this.$props.date) ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
