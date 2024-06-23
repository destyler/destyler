import { computed, defineComponent, h } from 'vue'
import { useCollection, useForwardExpose } from '@destyler/composition'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { DestylerSliderThumbImpl } from './thumbImpl'

export const destylerSliderThumbProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerSliderThumbProps = ExtractPublicPropTypes<typeof destylerSliderThumbProps>

export const DestylerSliderThumb = defineComponent({
  name: 'DestylerSliderThumb',
  props: destylerSliderThumbProps,
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
    return h(DestylerSliderThumbImpl, {
      ...this.$attrs,
      ref: (el: any) => this.forwardRef(el),
      index: this.index,
    }, () => this.$slots.default?.())
  },
})
