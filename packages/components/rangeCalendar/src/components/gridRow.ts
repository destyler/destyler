import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarGridRowProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'tr',
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
