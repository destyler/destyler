import { computed, defineComponent, h } from 'vue'
import { useForwardExpose } from '@destyler/composition'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection } from '@destyler/collection/composition'

import { SliderThumbImpl } from './thumbImpl'

export const sliderThumbProps = {
  ...primitiveProps,
} as const

export type SliderThumbProps = ExtractPublicPropTypes<typeof sliderThumbProps>

export const SliderThumb = defineComponent({
  name: 'DestylerSliderThumb',
  props: sliderThumbProps,

  setup() {
    const { getItems } = useCollection()

    const { forwardRef, currentElement: thumbElement } = useForwardExpose()

    const index = computed(() => thumbElement.value ? getItems().findIndex(i => i.ref === thumbElement.value) : -1)

    return {
      index,
      forwardRef,
    }
  },
  render() {
    return h(SliderThumbImpl, {
      ...this.$props,
      ref: (el: any) => this.forwardRef(el),
      index: this.index,
    }, () => this.$slots.default?.())
  },
})
