import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { DateValue } from '@internationalized/date'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectRangeCalendarRootContext } from './root'

export const destylerRangeCalendarCellProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'td',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  date: {
    type: Object as PropType<DateValue>,
    required: true,
  },
} as const

export type DestylerRangeCalendarCellProps = ExtractPublicPropTypes<typeof destylerRangeCalendarCellProps>

export const DestylerRangeCalendarCell = defineComponent({
  name: 'DestylerRangeCalendarCell',
  props: destylerRangeCalendarCellProps,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'role': 'gridcell',
      'aria-selected': this.rootContext.isSelected(this.$props.date) ? true : undefined,
      'aria-disabled': this.rootContext.isDateDisabled(this.$props.date) || this.rootContext.isDateUnavailable?.(this.$props.date),
      'data-disabled': this.rootContext.isDateDisabled(this.$props.date) ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
