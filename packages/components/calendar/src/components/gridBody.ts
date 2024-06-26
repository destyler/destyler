import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarGridBodyProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'tbody',
  },
} as const

export type DestylerCalendarGridBodyProps = ExtractPublicPropTypes<typeof destylerCalendarGridBodyProps>

export const DestylerCalendarGridBody = defineComponent({
  name: 'DestylerCalendarGridBody',
  props: destylerCalendarGridBodyProps,
  setup(_) {
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
