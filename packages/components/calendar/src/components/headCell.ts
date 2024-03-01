import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarHeadCellProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'th',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerCalendarHeadCellProps = ExtractPublicPropTypes<typeof destylerCalendarHeadCellProps>

export const DestylerCalendarHeadCell = defineComponent({
  name: 'DestylerCalendarHeadCell',
  props: destylerCalendarHeadCellProps,
  setup(_) {

  },
  render() {
    return h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
