import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

import { injectSliderRootContext } from './sliderRoot'

export const destylerSliderTrackProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
}

export const DestylerSliderTrack = defineComponent({
  name: 'DestylerSliderTrack',
  props: destylerSliderTrackProps,
  setup() {
    const rootContext = injectSliderRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, this.$slots.default?.())
  },
})
