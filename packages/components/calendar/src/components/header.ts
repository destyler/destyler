import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerCalendarHeaderProps = {
  ...destylerPrimitiveProps,
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
