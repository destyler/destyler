import { defineComponent, h, withDirectives } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { CollapsibleTrigger } from '@destyler/collapsible'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCollapseItemContext } from './item'
import { injectCollapseRootContext } from './root'

export const collapseTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type CollapseTriggerProps = ExtractPublicPropTypes<typeof collapseTriggerProps>

export const CollapseTrigger = defineComponent({
  name: 'DestylerCollapseTrigger',
  props: collapseTriggerProps,

  setup() {
    const rootContext = injectCollapseRootContext()
    const itemContext = injectCollapseItemContext()

    function changeItem() {
      if (itemContext.disabled.value)
        return
      rootContext.changeModelValue(itemContext.value.value)
    }

    return {
      changeItem,
      rootContext,
      itemContext,
    }
  },
  render() {
    return withDirectives(h(CollapsibleTrigger, {
      'ref': this.itemContext.currentRef,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-destyler-collection-item': '',
      'aria-controls': this.itemContext.triggerId,
      'aria-disabled': this.itemContext.disabled.value || undefined,
      'aria-expanded': this.itemContext.open.value || false,
      'data-disabled': this.itemContext.dataDisabled.value,
      'data-orientation': this.rootContext.orientation,
      'data-state': this.itemContext.dataState.value,
      'disabled': this.itemContext.disabled.value,
      'onClick': () => {
        this.changeItem()
      },
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.itemContext.triggerId }],
    ])
  },
})
