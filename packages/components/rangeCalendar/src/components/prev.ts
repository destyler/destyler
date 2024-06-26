import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectRangeCalendarRootContext } from './root'

export const destylerRangeCalendarPrevProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerRangeCalendarPrevProps = ExtractPublicPropTypes<typeof destylerRangeCalendarPrevProps>

export const DestylerRangeCalendarPrev = defineComponent({
  name: 'DestylerRangeCalendarPrev',
  props: destylerRangeCalendarPrevProps,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

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
