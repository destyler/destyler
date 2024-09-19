import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const calendarGridBodyProps = {
  ...primitiveProps,
  /**
   * @default tbody
   */
  as: {
    ...primitiveProps.as,
    default: 'tbody',
  },
} as const

export type CalendarGridBodyProps = ExtractPublicPropTypes<typeof calendarGridBodyProps>

export const CalendarGridBody = defineComponent({
  name: 'DestylerCalendarGridBody',
  props: calendarGridBodyProps,
  setup(_) {
  },
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
