import { defineComponent, h } from 'vue'
import { CollapsibleContent } from '@destyler/collapsible'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { primitiveProps } from '@destyler/primitive'
import { injectCollapseRootContext } from './root'
import { injectCollapseItemContext } from './item'

export const collapseContentProps = {
  asChild: primitiveProps.asChild,
} as const

export type CollapseContentProps = ExtractPublicPropTypes<typeof collapseContentProps>

export const CollapseContent = defineComponent({
  name: 'DestylerCollapseContent',
  props: collapseContentProps,

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
    return h(CollapsibleContent, {
      'role': 'region',
      'open': this.itemContext.open.value,
      'hidden': !this.itemContext.open.value,
      'asChild': this.$props.asChild,
      'aria-labelledby': this.itemContext.triggerId,
      'data-state': this.itemContext.dataState.value,
      'data-disabled': this.itemContext.dataDisabled.value,
      'data-orientation': this.rootContext.orientation,
      'style': '--destyler-collapse-content-width: var(--destyler-collapsible-content-width);--destyler-collapse-content-height: var(--destyler-collapsible-content-height);',
    }, () => this.$slots.default?.())
  },
})
