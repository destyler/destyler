import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectCollapseRootContext } from './root'
import { injectCollapseItemContext } from './item'

export const collapseHeaderProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'h3',
  },
} as const

export type CollapseHeaderProps = ExtractPublicPropTypes<typeof collapseHeaderProps>

export const CollapseHeader = defineComponent({
  name: 'DestylerCollapseHeader',
  props: collapseHeaderProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectCollapseRootContext()
    const itemContext = injectCollapseItemContext()
    useForwardExpose()
    return {
      rootContext,
      itemContext,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-orientation': this.rootContext.orientation,
      'data-state': this.itemContext.dataState.value,
      'data-disabled': this.itemContext.dataDisabled.value,
    }, () => this.$slots.default?.())
  },
})
