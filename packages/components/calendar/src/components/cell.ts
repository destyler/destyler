import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { DateValue } from '@internationalized/date'

import { injectCalendarRootContext } from './root'

export const calendarCellProps = {
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

export type CalendarCellProps = ExtractPublicPropTypes<typeof calendarCellProps>

export const CalendarCell = defineComponent({
  name: 'DestylerCalendarCell',
  props: calendarCellProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectCalendarRootContext()
    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'role': 'gridcell',
      'aria-selected': this.rootContext.isDateSelected(this.$props.date) ? true : undefined,
      'aria-disabled': this.rootContext.isDateDisabled(this.$props.date) || this.rootContext.isDateUnavailable?.(this.$props.date),
      'data-disabled': this.rootContext.isDateDisabled(this.$props.date) ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
