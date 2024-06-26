import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarPrevProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerCalendarPrevProps = ExtractPublicPropTypes<typeof destylerCalendarPrevProps>

export const DestylerCalendarPrev = defineComponent({
  name: 'DestylerCalendarPrev',
  props: destylerCalendarPrevProps,
  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'Previous page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-disabled': this.rootContext.isPrevButtonDisabled.value || undefined,
      'data-disabled': this.rootContext.isPrevButtonDisabled.value || undefined,
      'disabled': this.rootContext.isPrevButtonDisabled.value,
      'onClick': () => {
        this.rootContext.prevPage()
      },
    }), {
      default: () => this.$slots.default ? this.$slots.default?.() : 'Prev page',
    })
  },
})
