import { defineComponent, h, withDirectives } from 'vue'
import { destylerPrimitiveProp } from '@destyler/primitive'
import { DestylerCollapsibleContent } from '@destyler/collapsible'
import { BindOnceDirective } from '@destyler/directives'
import { injectCollapseRootContext } from './collapseRoot'
import { injectCollapseItemContext } from './CollapseItem'

const destylerCollapseContentProps = {
  ...destylerPrimitiveProp,
}

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
      'style': {
        '--destyler_collapse_content_width': `var(--destyler_collapsible_content_width)`,
        '--destyler_collapse_content_height': `var(--destyler_collapsible_content_height)`,
      },
    }, this.$slots.default?.()), [
      [BindOnceDirective, { id: this.itemContext.triggerId }],
    ])
  },
})
