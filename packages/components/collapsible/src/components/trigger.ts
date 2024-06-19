import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectCollapsibleRootContext } from './root'

export const destylerCollapsibleTriggerProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerCollapsibleTriggerProps = ExtractPublicPropTypes<typeof destylerCollapsibleTriggerProps>

export const DestylerCollapsibleTrigger = defineComponent({
  name: 'DestylerCollapsibleTrigger',
  props: destylerCollapsibleTriggerProps,
  setup() {
    const rootContext = injectCollapsibleRootContext()

    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
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
