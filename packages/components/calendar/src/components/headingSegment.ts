import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { CalendarView, ExtractPublicPropTypes } from '@destyler/shared'

import { injectCalendarRootContext } from './root'

export const destylerCalendarHeadingSegmentProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  type: {
    type: String as PropType<'month' | 'year' | 'literal'>,
    required: false,
  },
  value: {
    type: String as PropType<string>,
    required: false,
  },
}

export type DestylerCalendarHeadingSegmentProps = ExtractPublicPropTypes<typeof destylerCalendarHeadingSegmentProps>

export const DestylerCalendarHeadingSegment = defineComponent({
  name: 'DestylerCalendarHeadingSegment',
  props: destylerCalendarHeadingSegmentProps,
  setup(props) {
    const rootContext = injectCalendarRootContext()

    const setViewArg = computed((): CalendarView | null => {
      if (props.type === 'month')
        return 'year'

      if (props.type === 'year')
        return 'decade'

      return null
    })

    return {
      rootContext,
      setViewArg,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      onClick: () => {
        return this.setViewArg ? this.rootContext.setView(this.setViewArg as CalendarView) : undefined
      },
    }), {
      default: () => this.$slots.default ? this.$slots.default?.() : this.$props.value,
    })
  },
})
