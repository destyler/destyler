import { defineComponent, h, mergeProps, SlotsType, VNode } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const rangeCalendarHeaderProps = {
  ...primitiveProps,
} as const

export type RangeCalendarHeaderProps = ExtractPublicPropTypes<typeof rangeCalendarHeaderProps>

export const RangeCalendarHeader = defineComponent({
  name: 'DestylerRangeCalendarHeader',
  props: rangeCalendarHeaderProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  render() {
    return h(Primitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
