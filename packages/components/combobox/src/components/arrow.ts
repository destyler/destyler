import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperArrow } from '@destyler/popper'

import { injectComboboxRootContext } from './root'
import { injectComboboxContentContext } from './contentImpl'

export const destylerComboboxArrowProps = {
  ...destylerPrimitiveProps,
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
    ...destylerPrimitiveProps.as,
    default: 'svg',
  },
} as const

export type DestylerComboboxArrowProps = ExtractPublicPropTypes<typeof destylerComboboxArrowProps>

export const DestylerComboboxArrow = defineComponent({
  name: 'DestylerComboboxArrow',
  props: destylerComboboxArrowProps,
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
      return h(DestylerPopperArrow, this.$props, () => this.$slots.default?.())
  },
})
