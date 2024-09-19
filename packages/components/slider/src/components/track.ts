import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectSliderRootContext } from './root'

export const sliderTrackProps = {
  ...primitiveProps,
  /**
   * @default span
   */
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

    useForwardExpose()
    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'data-orientation': this.rootContext.orientation.value,
    }, () => this.$slots.default?.())
  },
})
