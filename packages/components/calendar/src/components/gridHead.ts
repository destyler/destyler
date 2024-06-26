import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarGridHeadProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'thead',
  },
} as const

export type DestylerCalendarGridHeadProps = ExtractPublicPropTypes<typeof destylerCalendarGridHeadProps>

export const DestylerCalendarGridHead = defineComponent({
  name: 'DestylerCalendarGridHead',
  props: destylerCalendarGridHeadProps,
  setup(_) {
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-hidden': 'true',
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
