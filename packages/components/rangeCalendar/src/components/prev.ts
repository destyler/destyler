import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { injectRangeCalendarRootContext } from './root'

export const destylerRangeCalendarPrevProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
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
