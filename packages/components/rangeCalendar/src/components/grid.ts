import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarGridProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'table',
  },
} as const

export type RangeCalendarGridProps = ExtractPublicPropTypes<typeof rangeCalendarGridProps>

export const RangeCalendarGrid = defineComponent({
  name: 'DestylerRangeCalendarGrid',
  props: rangeCalendarGridProps,

  setup() {
    const rootContext = injectRangeCalendarRootContext()

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
