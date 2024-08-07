import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { PopperArrow, popperArrowProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectRootContext } from './root'
import { injectSelectContentContext } from './contentImpl'

export const selectArrowProps = {
  ...popperArrowProps,
} as const

export type SelectArrowProps = ExtractPublicPropTypes<typeof selectArrowProps>

export const SelectArrow = defineComponent({
  name: 'DestylerSelectArrow',
  props: selectArrowProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext()
    return {
      rootContext,
      contentContext,
    }
  },
  render() {
    if (this.rootContext.open.value && this.contentContext.position === 'popper')
      return h(PopperArrow, { ...this.$props }, () => this.$slots.default?.())
  },
})
