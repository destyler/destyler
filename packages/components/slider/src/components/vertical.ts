import { computed, defineComponent, h, ref, toRefs } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { BACK_KEYS, linearScale, provideSliderOrientationContext, sliderOrientationPrivateEmits, sliderOrientationPrivateProps } from '../utils'
import { SliderImpl } from './impl'

export const sliderVerticalProps = {
  ...sliderOrientationPrivateProps,
} as const

export type SliderVerticalProps = ExtractPublicPropTypes<typeof sliderVerticalProps>

export const sliderVerticalEmits = {
  ...sliderOrientationPrivateEmits,
}

export const SliderVertical = defineComponent({
  name: 'DestylerSliderVertical',
  props: sliderVerticalProps,
  emits: sliderVerticalEmits,

  setup(props) {
    const { max, min, inverted } = toRefs(props)

    const { forwardRef, currentElement: sliderElement } = useForwardExpose()

    const rectRef = ref<DOMRect>()
    const isSlidingFromBottom = computed(() => !inverted.value)

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.value || sliderElement.value!.getBoundingClientRect()
      const input: [number, number] = [0, rect.height]
      const output: [number, number] = isSlidingFromBottom.value ? [max.value, min.value] : [min.value, max.value]
      const value = linearScale(input, output)

      rectRef.value = rect
      return value(pointerPosition - rect.top)
    }

    provideSliderOrientationContext({
      startEdge: isSlidingFromBottom.value ? 'bottom' : 'top',
      endEdge: isSlidingFromBottom.value ? 'top' : 'bottom',
      size: 'height',
      direction: isSlidingFromBottom.value ? 1 : -1,
    })

    return {
      min,
      max,
      inverted,
      forwardRef,
      getValueFromPointer,
      rectRef,
      isSlidingFromBottom,
    }
  },
  render() {
    return h(SliderImpl, {
      'ref': (el: any) => this.forwardRef(el),
      'data-orientation': 'vertical',
      'style': {
        ['--destyler-slider-thumb-transform' as any]: 'translateY(50%)',
      },
      'onSlideStart': (event: any) => {
        const value = this.getValueFromPointer(event.clientY)
        this.$emit('slideStart', value)
      },
      'onSlideMove': (event) => {
        const value = this.getValueFromPointer(event.clientY)
        this.$emit('slideMove', value)
      },
      'onSlideEnd': () => {
        this.rectRef = undefined
        this.$emit('slideEnd')
      },
      'onStepKeyDown': (event: any) => {
        const slideDirection = this.isSlidingFromBottom ? 'from-bottom' : 'from-top'
        const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
        this.$emit('stepKeyDown', event, isBackKey ? -1 : 1)
      },
      'onEndKeyDown': (event: any) => {
        this.$emit('endKeyDown', event)
      },
      'onHomeKeyDown': (event: any) => {
        this.$emit('homeKeyDown', event)
      },
    }, () => this.$slots.default?.())
  },
})
