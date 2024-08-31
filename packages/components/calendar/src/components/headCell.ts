import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const calendarHeadCellProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'th',
  },
} as const

export type CalendarHeadCellProps = ExtractPublicPropTypes<typeof calendarHeadCellProps>

export const CalendarHeadCell = defineComponent({
  name: 'DestylerCalendarHeadCell',
  props: calendarHeadCellProps,

  setup(_) {

  },
  render() {
    return h(Primitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
