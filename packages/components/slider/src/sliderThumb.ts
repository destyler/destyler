import { computed, defineComponent, h, mergeProps } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { useCollection, useCustomElement } from '@destyler/composition'

import { DestylerSliderThumbImpl } from './sliderThumbImpl'

export const destylerSliderThumbProps = {
  ...destylerPrimitiveProps,
}

export const DestylerSliderThumb = defineComponent({
  name: 'DestylerSliderThumb',
  props: destylerSliderThumbProps,
  setup() {
    const { injectCollection } = useCollection('sliderThumb')
    const collections = injectCollection()

    const { customElement, currentElement: thumbElement } = useCustomElement()

    const index = computed(() => thumbElement.value ? collections.value.findIndex(i => i === thumbElement.value) : -1)

    return {
      index,
      customElement,
    }
  },
  render() {
    return h(DestylerSliderThumbImpl, mergeProps(this.$attrs, {
      ref: 'customElement',
      index: this.index,
    }), this.$slots.default?.())
  },
})
