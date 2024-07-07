import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { useCollection, useForwardExpose } from '@destyler/composition'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SliderThumbImpl } from './thumbImpl'

export const sliderThumbProps = {
  ...primitiveProps,
} as const

export type SliderThumbProps = ExtractPublicPropTypes<typeof sliderThumbProps>

export const SliderThumb = defineComponent({
  name: 'DestylerSliderThumb',
  props: sliderThumbProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const { injectCollection } = useCollection('sliderThumb')
    const collections = injectCollection()

    const { forwardRef, currentElement: thumbElement } = useForwardExpose()

    const index = computed(() => thumbElement.value ? collections.value.findIndex(i => i === thumbElement.value) : -1)

    return {
      index,
      forwardRef,
    }
  },
  render() {
    return h(SliderThumbImpl, {
      ...this.$attrs,
      ref: (el: any) => this.forwardRef(el),
      index: this.index,
    }, () => this.$slots.default?.())
  },
})
