import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { ARROW_KEYS, PAGE_KEYS } from '../utils'
import { injectSliderRootContext } from './root'

export const sliderImplProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type SliderImplProps = ExtractPublicPropTypes<typeof sliderImplProps>

export const sliderImplEmits = {
  slideStart: (_event: PointerEvent) => true,
  slideMove: (_event: PointerEvent) => true,
  slideEnd: (_event: PointerEvent) => true,
  homeKeyDown: (_event: KeyboardEvent) => true,
  endKeyDown: (_event: KeyboardEvent) => true,
  stepKeyDown: (_event: KeyboardEvent) => true,
}

export const SliderImpl = defineComponent({
  name: 'DestylerSliderImpl',
  props: sliderImplProps,
  emits: sliderImplEmits,

  setup() {
    const rootContent = injectSliderRootContext()
    return {
      rootContent,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'data-slider-impl': '',
      'onKeydown': (event: any) => {
        if (event.key === 'Home') {
          this.$emit('homeKeyDown', event)
          event.preventDefault()
        }
        else if (event.key === 'End') {
          this.$emit('endKeyDown', event)
          event.preventDefault()
        }
        else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
          this.$emit('stepKeyDown', event)
          event.preventDefault()
        }
      },
      'onPointerdown': (event: any) => {
        const target = event.target as HTMLElement
        target.setPointerCapture(event.pointerId)
        event.preventDefault()
        if (this.rootContent.thumbElements.value.includes(target))
          target.focus()
        else
          this.$emit('slideStart', event)
      },
      'onPointermove': (event: any) => {
        const target = event.target as HTMLElement
        if (target.hasPointerCapture(event.pointerId))
          this.$emit('slideMove', event)
      },
      'onPointerup': (event: any) => {
        const target = event.target as HTMLElement
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId)
          this.$emit('slideEnd', event)
        }
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
