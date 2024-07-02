import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperArrow } from '@destyler/popper'

import { injectComboboxRootContext } from './root'
import { injectComboboxContentContext } from './contentImpl'

export const comboboxArrowProps = {
  ...primitiveProps,
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
  as: {
    ...primitiveProps.as,
    default: 'svg',
  },
} as const

export type ComboboxArrowProps = ExtractPublicPropTypes<typeof comboboxArrowProps>

export const ComboboxArrow = defineComponent({
  name: 'DestylerComboboxArrow',
  props: comboboxArrowProps,
  setup() {
    useForwardExpose()
    const rootContext = injectComboboxRootContext()
    const contentContext = injectComboboxContentContext()
    return {
      rootContext,
      contentContext,
    }
  },
  render() {
    if (this.rootContext.open.value && this.contentContext.position.value === 'popper')
      return h(PopperArrow, this.$props, () => this.$slots.default?.())
  },
})
