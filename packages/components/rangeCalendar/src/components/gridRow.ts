import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarGridRowProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'tr',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerRangeCalendarGridRowProps = ExtractPublicPropTypes<typeof destylerRangeCalendarGridRowProps>

export const DestylerRangeCalendarGridRow = defineComponent({
  name: 'DestylerRangeCalendarGridRow',
  props: destylerRangeCalendarGridRowProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
