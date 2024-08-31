import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { PopperArrow } from '@destyler/popper'
import { popperArrowProps } from '@destyler/popper/component'

import { injectComboboxRootContext } from './root'
import { injectComboboxContentContext } from './contentImpl'

export const comboboxArrowProps = {
  ...popperArrowProps,
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
    else
      return null
  },
})
