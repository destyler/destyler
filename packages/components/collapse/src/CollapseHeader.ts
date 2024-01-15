import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { injectCollapseRootContext } from './collapseRoot'
import { injectCollapseItemContext } from './CollapseItem'

export const destylerCollapseHeaderProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'h3',
  },
}

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
