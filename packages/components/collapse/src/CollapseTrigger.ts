import { defineComponent, h, withDirectives } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { DestylerCollapsibleTrigger } from '@destyler/collapsible'
import { BindOnceDirective } from '@destyler/directives'
import { injectCollapseItemContext } from './CollapseItem'
import { injectCollapseRootContext } from './collapseRoot'

export const destylerCollapseTriggerProps = {
  ...destylerPrimitiveProps,
}

export const DestylerCollapseTrigger = defineComponent({
  name: 'DestylerCollapseTrigger',
  props: destylerCollapseTriggerProps,
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
    return withDirectives(h(DestylerCollapsibleTrigger, {
      'ref': this.itemContext.customElement,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-controls': this.itemContext.triggerId,
      'aria-disabled': this.itemContext.disabled.value || undefined,
      'aria-expanded': this.itemContext.open.value || false,
      'data-disabled': this.itemContext.dataDisabled.value,
      'data-orientation': this.rootContext.orientation,
      'data-state': this.itemContext.dataState.value,
      'disabled': this.itemContext.disabled.value,
      'onClick': this.changeItem,
    }, this.$slots.default?.()), [
      [BindOnceDirective, { id: this.itemContext.triggerId }],
    ])
  },
})
