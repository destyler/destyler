import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const calendarGridProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'table',
  },
} as const

export type CalendarGridProps = ExtractPublicPropTypes<typeof calendarGridProps>

export const CalendarGrid = defineComponent({
  name: 'DestylerCalendarGrid',
  props: calendarGridProps,

  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'tabindex': '-1',
      'role': 'grid',
      'aria-readonly': this.rootContext.readonly ? true : undefined,
      'aria-disabled': this.rootContext.disabled ? true : undefined,
      'data-readonly': this.rootContext.readonly ? '' : undefined,
      'data-disabled': this.rootContext.disabled ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
