import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarHeaderProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerRangeCalendarHeaderProps = ExtractPublicPropTypes<typeof destylerRangeCalendarHeaderProps>

export const DestylerRangeCalendarHeader = defineComponent({
  name: 'DestylerRangeCalendarHeader',
  props: destylerRangeCalendarHeaderProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
