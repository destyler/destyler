import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const calendarHeaderProps = {
  ...primitiveProps,
} as const

export type CalendarHeaderProps = ExtractPublicPropTypes<typeof calendarHeaderProps>

export const CalendarHeader = defineComponent({
  name: 'DestylerCalendarHeader',
  props: calendarHeaderProps,

  setup(_) {

  },
  render() {
    return h(Primitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
