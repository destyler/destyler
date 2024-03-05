import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarGridBodyProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'tbody',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
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
