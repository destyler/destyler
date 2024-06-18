import { defineComponent, h } from 'vue'
import { DestylerCollapsibleContent } from '@destyler/collapsible'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { destylerPrimitiveProps } from '@destyler/primitive'
import { injectCollapseRootContext } from './root'
import { injectCollapseItemContext } from './item'

export const destylerCollapseContentProps = {
  asChild: destylerPrimitiveProps.asChild,
} as const

export type DestylerCollapseContentProps = ExtractPublicPropTypes<typeof destylerCollapseContentProps>

export const DestylerCollapseContent = defineComponent({
  name: 'DestylerCollapseContent',
  props: destylerCollapseContentProps,
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
    return h(DestylerCollapsibleContent, {
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
