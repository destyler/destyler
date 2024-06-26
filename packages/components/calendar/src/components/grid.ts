import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarGridProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'table',
  },
} as const

export type DestylerCalendarGridProps = ExtractPublicPropTypes<typeof destylerCalendarGridProps>

export const DestylerCalendarGrid = defineComponent({
  name: 'DestylerCalendarGrid',
  props: destylerCalendarGridProps,
  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'tabindex': '-1',
      'role': 'grid',
      'aria-readonly': this.rootContext.readonly ? true : undefined,
      'aria-disabled': this.rootContext.disabled ? true : undefined,
      'data-readonly': this.rootContext.readonly ? '' : undefined,
      'data-disabled': this.rootContext.disabled ? '' : undefined,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
