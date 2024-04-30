import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperArrow } from '@destyler/popper'

import { injectComboboxRootContext } from './root'
import { injectComboboxContentContext } from './contentImpl'

export const destylerComboboxArrowProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
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
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
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
