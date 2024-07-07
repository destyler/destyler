import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarHeadingProps = {
  ...primitiveProps,
} as const

export type RangeCalendarHeadingProps = ExtractPublicPropTypes<typeof rangeCalendarHeadingProps>

export const RangeCalendarHeading = defineComponent({
  name: 'DestylerRangeCalendarHeading',
  props: rangeCalendarHeadingProps,
  slots: Object as SlotsType<{
    default: (opts: { headingValue: string }) => VNode[]
  }>,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
    }), {
      default: () => this.$slots.default
        ? this.$slots.default?.({
          headingValue: this.rootContext.headingValue.value,
        })
        : this.rootContext.headingValue.value,
    })
  },
})
