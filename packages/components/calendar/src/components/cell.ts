import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import type { DateValue } from '@internationalized/date'

import { injectCalendarRootContext } from './root'

export const destylerCalendarCellProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'td',
  },
  date: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type DestylerCalendarCellProps = ExtractPublicPropTypes<typeof destylerCalendarCellProps>

export const DestylerCalendarCell = defineComponent({
  name: 'DestylerCalendarCell',
  props: destylerCalendarCellProps,
  setup() {
    const rootContext = injectCalendarRootContext()
    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'role': 'gridcell',
      'aria-selected': this.rootContext.isDateSelected(this.$props.date) ? true : undefined,
      'aria-disabled': this.rootContext.isDateDisabled(this.$props.date) || this.rootContext.isDateUnavailable?.(this.$props.date),
      'data-disabled': this.rootContext.isDateDisabled(this.$props.date) ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
