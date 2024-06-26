import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarGridRowProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'tr',
  },
} as const

export type DestylerCalendarGridRowProps = ExtractPublicPropTypes<typeof destylerCalendarGridRowProps>

export const DestylerCalendarGridRow = defineComponent({
  name: 'DestylerCalendarGridRow',
  props: destylerCalendarGridRowProps,
  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props), {
      default: () => this.$slots.default?.(),
    })
  },
})
