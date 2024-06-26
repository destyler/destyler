import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarNextProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerCalendarNextProps = ExtractPublicPropTypes<typeof destylerCalendarNextProps>

export const DestylerCalendarNext = defineComponent({
  name: 'DestylerCalendarNext',
  props: destylerCalendarNextProps,
  setup(_) {
    const rootContext = injectCalendarRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'aria-label': 'Next page',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-disabled': this.rootContext.isPrevButtonDisabled.value || undefined,
      'data-disabled': this.rootContext.isPrevButtonDisabled.value || undefined,
      'disabled': this.rootContext.isPrevButtonDisabled.value,
      'onClick': () => {
        this.rootContext.nextPage()
      },
    }), {
      default: () => this.$slots.default ? this.$slots.default?.() : 'Next page',
    })
  },
})
