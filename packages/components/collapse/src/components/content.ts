import type { PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { DestylerCollapsibleContent } from '@destyler/collapsible'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCollapseRootContext } from './root'
import { injectCollapseItemContext } from './item'

const destylerCollapseContentProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerCollapseContentProps = ExtractPublicPropTypes<typeof destylerCollapseContentProps>

export const DestylerCollapseContent = defineComponent({
  name: 'DestylerCollapseContent',
  props: destylerCollapseContentProps,
  setup() {
    const rootContext = injectCollapseRootContext()
    const itemContext = injectCollapseItemContext()
    return {
      rootContext,
      itemContext,
    }
  },
  render() {
    return withDirectives(h(DestylerCollapsibleContent, {
      'role': 'region',
      'open': this.itemContext.open.value,
      'hidden': !this.itemContext.open.value,
      'asChild': this.$props.asChild,
      'aria-labelledby': this.itemContext.triggerId,
      'data-state': this.itemContext.dataState.value,
      'data-disabled': this.itemContext.dataDisabled.value,
      'data-orientation': this.rootContext.orientation,
      'style': '--destyler_collapse_content_width: var(--destyler_collapsible_content_width);--destyler_collapse_content_height: var(--destyler_collapsible_content_height);',
    }, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.itemContext.triggerId }],
    ])
  },
})
