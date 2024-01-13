import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverCloseProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
}

export const DestylerPopoverClose = defineComponent({
  name: 'DestylerPopoverClose',
  props: destylerPopoverCloseProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: this.rootContext.onOpenChange(false),
    }, this.$slots.default?.())
  },
})
