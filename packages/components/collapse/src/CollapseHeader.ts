import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCollapseRootContext } from './collapseRoot'
import { injectCollapseItemContext } from './CollapseItem'

export const destylerCollapseHeaderProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'h3',
  },
} as const

export type DestylerCollapseHeaderProps = ExtractPublicPropTypes<typeof destylerCollapseHeaderProps>

export const DestylerCollapseHeader = defineComponent({
  name: 'DestylerCollapseHeader',
  props: destylerCollapseHeaderProps,
  setup() {
    const rootContext = injectCollapseRootContext()
    const itemContext = injectCollapseItemContext()
    return {
      rootContext,
      itemContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-orientation': this.rootContext.orientation,
      'data-state': this.itemContext.dataState.value,
      'data-disabled': this.itemContext.dataDisabled.value,
    }, this.$slots.default?.())
  },
})
