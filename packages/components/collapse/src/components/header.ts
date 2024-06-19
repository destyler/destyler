import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectCollapseRootContext } from './root'
import { injectCollapseItemContext } from './item'

export const destylerCollapseHeaderProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
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
    useForwardExpose()
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
    }, () => this.$slots.default?.())
  },
})
