import { computed, defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { convertValueToPercentage, injectSliderOrientationContext } from '../utils'
import { injectSliderRootContext } from './root'

export const destylerSliderRangeProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerSliderRangeProps = ExtractPublicPropTypes<typeof destylerSliderRangeProps>

export const DestylerSliderRange = defineComponent({
  name: 'DestylerSliderRange',
  props: destylerSliderRangeProps,
  setup() {
    const rootContext = injectSliderRootContext()
    const orientation = injectSliderOrientationContext()

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
    return h(DestylerPrimitive, {
      'data-disabled': this.rootContext.disabled.value,
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
