import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarHeadingProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerCalendarHeadingProps = ExtractPublicPropTypes<typeof destylerCalendarHeadingProps>

export const DestylerCalendarHeading = defineComponent({
  name: 'DestylerCalendarHeading',
  props: destylerCalendarHeadingProps,
  setup() {
    const rootContext = injectCalendarRootContext()
    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
    }), {
      default: () => this.$slots.default ? this.$slots.default?.({ headingValue: this.rootContext.headingValue.value }) : this.rootContext.headingValue.value,
    })
  },
})
