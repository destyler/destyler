import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarGridHeadProps = {
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
