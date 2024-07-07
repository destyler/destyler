import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectRangeCalendarRootContext } from './root'

export const rangeCalendarNextProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type RangeCalendarNextProps = ExtractPublicPropTypes<typeof rangeCalendarNextProps>

export const RangeCalendarNext = defineComponent({
  name: 'DestylerRangeCalendarNext',
  props: rangeCalendarNextProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'aria-label': 'Next page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-disabled': this.rootContext.isNextButtonDisabled.value || undefined,
      'data-disabled': this.rootContext.isNextButtonDisabled.value || undefined,
      'disabled': this.rootContext.isNextButtonDisabled.value,
      'onClick': () => {
        this.rootContext.nextPage()
      },
    }), {
      default: () => this.$slots.default ? this.$slots.default?.() : 'Next page',
    })
  },
})
