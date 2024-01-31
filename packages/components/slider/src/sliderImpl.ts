import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSliderRootContext } from './sliderRoot'
import { ARROW_KEYS, PAGE_KEYS } from './utils'

export const destylerSliderImplProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
}

export type DestylerSliderImplProps = ExtractPublicPropTypes<typeof destylerSliderImplProps>

export const DestylerSliderImpl = defineComponent({
  name: 'DestylerSliderImpl',
  props: destylerSliderImplProps,
  emits: ['slideStart', 'slideMove', 'slideEnd', 'homeKeyDown', 'endKeyDown', 'stepKeyDown'],
  setup() {
    const rootContent = injectSliderRootContext()
    return {
      rootContent,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
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
    }), this.$slots.default?.())
  },
})
