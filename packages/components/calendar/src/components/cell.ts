import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { DateValue } from '@internationalized/date'

import { injectCalendarRootContext } from './root'

export const calendarCellProps = {
  ...primitiveProps,
  /**
   * @default tds
   */
  as: {
    ...primitiveProps.as,
    default: 'td',
  },
  /**
   * The date value for the cell
   */
  date: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type CalendarCellProps = ExtractPublicPropTypes<typeof calendarCellProps>

export const CalendarCell = defineComponent({
  name: 'DestylerCalendarCell',
  props: calendarCellProps,
  setup() {
    const rootContext = injectCalendarRootContext()
    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'role': 'gridcell',
      'aria-selected': this.rootContext.isDateSelected(this.$props.date) ? true : undefined,
      'aria-disabled': this.rootContext.isDateDisabled(this.$props.date) || this.rootContext.isDateUnavailable?.(this.$props.date),
      'data-disabled': this.rootContext.isDateDisabled(this.$props.date) ? '' : undefined,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
