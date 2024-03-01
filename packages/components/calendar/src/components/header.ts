import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarHeaderProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerCalendarHeaderProps = ExtractPublicPropTypes<typeof destylerCalendarHeaderProps>

export const DestylerCalendarHeader = defineComponent({
  name: 'DestylerCalendarHeader',
  props: destylerCalendarHeaderProps,
  setup(_) {

  },
  render() {
    return h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
