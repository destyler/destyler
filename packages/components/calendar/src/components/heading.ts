import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const calendarHeadingProps = {
  ...primitiveProps,
} as const

export type CalendarHeadingProps = ExtractPublicPropTypes<typeof calendarHeadingProps>

export const CalendarHeading = defineComponent({
  name: 'DestylerCalendarHeading',
  props: calendarHeadingProps,
  setup() {
    const rootContext = injectCalendarRootContext()
    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
    }), {
      default: () => this.$slots.default ? this.$slots.default?.({ headingValue: this.rootContext.headingValue.value }) : this.rootContext.headingValue.value,
    })
  },
})
