import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarHeadCellProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'th',
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
