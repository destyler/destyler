import type { Component, PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { injectDialogRootContext } from './dialogRoot'

export const destylerDialogTitleProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'h2',
  },
}

export const DestylerDialogTitle = defineComponent({
  name: 'DestylerDialogTitle',
  props: destylerDialogTitleProps,
  setup() {
    const rootContext = injectDialogRootContext()

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
