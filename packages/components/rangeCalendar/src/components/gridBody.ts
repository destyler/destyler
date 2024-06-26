import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerRangeCalendarGridBodyProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'tbody',
  },
} as const

export type DestylerRangeCalendarGridBodyProps = ExtractPublicPropTypes<typeof destylerRangeCalendarGridBodyProps>

export const DestylerRangeCalendarGridBody = defineComponent({
  name: 'DestylerRangeCalendarGridBody',
  props: destylerRangeCalendarGridBodyProps,
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
