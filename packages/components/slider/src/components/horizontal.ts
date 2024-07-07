import type { PropType, SlotsType } from 'vue'
import { computed, defineComponent, h, ref, toRefs } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { BACK_KEYS, linearScale, provideSliderOrientationContext } from '../utils'
import { SliderImpl } from './impl'

export const sliderHorizontalProps = {
  min: {
    type: Number as PropType<number>,
    required: false,
  },
  max: {
    type: Number as PropType<number>,
    required: false,
  },
  inverted: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
} as const

export type SliderHorizontalProps = ExtractPublicPropTypes<typeof sliderHorizontalProps>

export const sliderHorizontalEmits = {
  slideEnd: () => true,
  slideStart: (_value: number) => true,
  slideMove: (_value: number) => true,
  homeKeyDown: (_event: KeyboardEvent) => true,
  endKeyDown: (_event: KeyboardEvent) => true,
  stepKeyDown: (_event: KeyboardEvent, _direction: number) => true,
}

export const SliderHorizontal = defineComponent({
  name: 'DestylerSliderHorizontal',
  props: sliderHorizontalProps,
  emits: sliderHorizontalEmits,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  setup(props) {
    const { max, min, dir, inverted } = toRefs(props)

    const { forwardRef, currentElement: sliderElement } = useForwardExpose()

    const rectRef = ref<DOMRect>()
    const isSlidingFromLeft = computed(() => (dir?.value === 'ltr' && !inverted.value) || (dir?.value !== 'ltr' && inverted.value))

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.value || sliderElement.value!.getBoundingClientRect()
      const input: [number, number] = [0, rect.width]
      const output: [number, number] = isSlidingFromLeft.value ? [min.value!, max.value!] : [max.value!, min.value!]
      const value = linearScale(input, output)

      rectRef.value = rect
      return value(pointerPosition - rect.left)
    }

    provideSliderOrientationContext({
      startEdge: isSlidingFromLeft.value ? 'left' : 'right',
      endEdge: isSlidingFromLeft.value ? 'right' : 'left',
      direction: isSlidingFromLeft.value ? 1 : -1,
      size: 'width',
    })

    return {
      dir,
      min,
      max,
      inverted,
      forwardRef,
      getValueFromPointer,
      rectRef,
      isSlidingFromLeft,
    }
  },
  render() {
    return h(SliderImpl, {
      'ref': (el: any) => this.forwardRef(el),
      'dir': this.dir,
      'data-orientation': 'horizontal',
      'style': {
        '--destyler_slider_thumb_transform': 'translateX(-50%)',
      },
      'onSlideStart': (event: any) => {
        const value = this.getValueFromPointer(event.clientX)
        this.$emit('slideStart', value)
      },
      'onSlideMove': (event: any) => {
        const value = this.getValueFromPointer(event.clientX)
        this.$emit('slideMove', value)
      },
      'onSlideEnd': () => {
        this.rectRef = undefined
        this.$emit('slideEnd')
      },
      'onStepKeyDown': (event: any) => {
        const slideDirection = this.isSlidingFromLeft ? 'from-left' : 'from-right'
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
