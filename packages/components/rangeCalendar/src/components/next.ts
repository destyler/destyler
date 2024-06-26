import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectRangeCalendarRootContext } from './root'

export const destylerRangeCalendarNextProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerRangeCalendarNextProps = ExtractPublicPropTypes<typeof destylerRangeCalendarNextProps>

export const DestylerRangeCalendarNext = defineComponent({
  name: 'DestylerRangeCalendarNext',
  props: destylerRangeCalendarNextProps,
  setup() {
    const rootContext = injectRangeCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
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
