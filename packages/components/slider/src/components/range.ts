import { computed, defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { convertValueToPercentage, injectSliderOrientationContext } from '../utils'
import { injectSliderRootContext } from './root'

export const sliderRangeProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SliderRangeProps = ExtractPublicPropTypes<typeof sliderRangeProps>

export const SliderRange = defineComponent({
  name: 'DestylerSliderRange',
  props: sliderRangeProps,
  setup() {
    const rootContext = injectSliderRootContext()
    const orientation = injectSliderOrientationContext()

    useForwardExpose()

    const percentages = computed(() => rootContext.modelValue?.value?.map(value =>
      convertValueToPercentage(value, rootContext.min.value, rootContext.max.value),
    ))

    const offsetStart = computed(() => rootContext.modelValue!.value!.length > 1 ? Math.min(...percentages.value!) : 0)
    const offsetEnd = computed(() => 100 - Math.max(...percentages.value!))

    return {
      rootContext,
      orientation,
      percentages,
      offsetStart,
      offsetEnd,
    }
  },
  render() {
    return h(Primitive, {
      'data-disabled': this.rootContext.disabled.value ? '' : undefined,
      'data-orientation': this.rootContext.orientation.value,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'style': {
        [this.orientation!.startEdge]: `${this.offsetStart}%`,
        [this.orientation!.endEdge]: `${this.offsetEnd}%`,
      },
    }, () => this.$slots.default?.())
  },
})
