import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarGridHeadProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'thead',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerRangeCalendarGridHeadProps = ExtractPublicPropTypes<typeof destylerRangeCalendarGridHeadProps>

export const DestylerRangeCalendarGridHead = defineComponent({
  name: 'DestylerRangeCalendarGridHead',
  props: destylerRangeCalendarGridHeadProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-hidden': true,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
