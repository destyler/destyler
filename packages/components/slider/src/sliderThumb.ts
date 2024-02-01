import type { Component, PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { useCollection, useCustomElement } from '@destyler/composition'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { DestylerSliderThumbImpl } from './sliderThumbImpl'

export const destylerSliderThumbProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerSliderThumbProps = ExtractPublicPropTypes<typeof destylerSliderThumbProps>

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
    return h(DestylerSliderThumbImpl, {
      ...this.$attrs,
      ref: 'customElement',
      index: this.index,
    }, this.$slots.default?.())
  },
})
