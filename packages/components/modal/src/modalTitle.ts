import type { Component, PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { injectModalRootContext } from './modalRoot'

export const destylerModalTitleProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'h2',
  },
}

export const DestylerModalTitle = defineComponent({
  name: 'DestylerModalTitle',
  props: destylerModalTitleProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.titleId }],
    ])
  },
})
