import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const calendarGridHeadProps = {
  ...primitiveProps,
  /**
   * @default thead
   */
  as: {
    ...primitiveProps.as,
    default: 'thead',
  },
} as const

export type CalendarGridHeadProps = ExtractPublicPropTypes<typeof calendarGridHeadProps>

export const CalendarGridHead = defineComponent({
  name: 'DestylerCalendarGridHead',
  props: calendarGridHeadProps,
  setup(_) {
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-hidden': 'true',
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
