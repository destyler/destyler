import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSliderRootContext } from './root'

export const sliderTrackProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SliderTrackProps = ExtractPublicPropTypes<typeof sliderTrackProps>

export const SliderTrack = defineComponent({
  name: 'DestylerSliderTrack',
  props: sliderTrackProps,
  setup() {
    const rootContext = injectSliderRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, () => this.$slots.default?.())
  },
})
