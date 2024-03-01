import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarHeadingProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
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
      default: () => this.$slots.default?.({ headingValue: this.rootContext.headingValue.value }),
    })
  },
})
