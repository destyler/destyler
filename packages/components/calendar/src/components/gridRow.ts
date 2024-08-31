import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const calendarGridRowProps = {
  ...primitiveProps,
  /**
   * @default tr
   */
  as: {
    ...primitiveProps.as,
    default: 'tr',
  },
} as const

export type CalendarGridRowProps = ExtractPublicPropTypes<typeof calendarGridRowProps>

export const CalendarGridRow = defineComponent({
  name: 'DestylerCalendarGridRow',
  props: calendarGridRowProps,
  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
