import type { PropType } from 'vue'
import { computed, defineComponent, h, ref, toRefs } from 'vue'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { BACK_KEYS, linearScale, provideSliderOrientationContext } from '../utils'
import { DestylerSliderImpl } from './impl'

export const destylerSliderVerticalProps = {
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
} as const

export type DestylerSliderVerticalProps = ExtractPublicPropTypes<typeof destylerSliderVerticalProps>

export const DestylerSliderVertical = defineComponent({
  name: 'DestylerSliderVertical',
  props: destylerSliderVerticalProps,
  emits: ['slideEnd', 'slideStart', 'slideMove', 'homeKeyDown', 'endKeyDown', 'stepKeyDown'],
  setup(props) {
    const { max, min, inverted } = toRefs(props)

    const { customElement, currentElement: sliderElement } = useCustomElement()

    const rectRef = ref<DOMRect>()
    const isSlidingFromBottom = computed(() => !inverted.value)

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.value || sliderElement.value!.getBoundingClientRect()
      const input: [number, number] = [0, rect.height]
      const output: [number, number] = isSlidingFromBottom.value ? [max.value!, min.value!] : [min.value!, max.value!]
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
      customElement,
      getValueFromPointer,
      rectRef,
      isSlidingFromBottom,
    }
  },
  render() {
    return h(DestylerSliderImpl, {
      'ref': 'customElement',
      'data-orientation': 'vertical',
      'style': {
        '--destyler_slider_thumb_transform': 'translateY(50%)',
      },
      'onSlideStart': (event: any) => {
        const value = this.getValueFromPointer(event.clientX)
        this.$emit('slideStart', value)
      },
      'onSlideMove': (event) => {
        const value = this.getValueFromPointer(event.clientX)
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
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
