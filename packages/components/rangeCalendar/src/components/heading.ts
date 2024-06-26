import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectRangeCalendarRootContext } from './root'

export const destylerRangeCalendarHeadingProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerRangeCalendarHeadingProps = ExtractPublicPropTypes<typeof destylerRangeCalendarHeadingProps>

export const DestylerRangeCalendarHeading = defineComponent({
  name: 'DestylerRangeCalendarHeading',
  props: destylerRangeCalendarHeadingProps,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
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
