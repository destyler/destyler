import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarPrevProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type RangeCalendarPrevProps = ExtractPublicPropTypes<typeof rangeCalendarPrevProps>

export const RangeCalendarPrev = defineComponent({
  name: 'DestylerRangeCalendarPrev',
  props: rangeCalendarPrevProps,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
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
