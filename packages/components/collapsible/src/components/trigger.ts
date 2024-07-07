import { defineComponent, h, SlotsType, VNode } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectCollapsibleRootContext } from './root'

export const collapsibleTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type CollapsibleTriggerProps = ExtractPublicPropTypes<typeof collapsibleTriggerProps>

export const CollapsibleTrigger = defineComponent({
  name: 'DestylerCollapsibleTrigger',
  props: collapsibleTriggerProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  setup() {
    const rootContext = injectCollapsibleRootContext()

    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-controls': this.rootContext.contentId,
      'aria-expanded': this.rootContext.open.value,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'data-disabled': this.rootContext.disabled?.value ? '' : undefined,
      'disabled': this.rootContext.disabled?.value,
      'onClick': this.rootContext.onOpenToggle,
    }, () => this.$slots.default?.())
  },
})
