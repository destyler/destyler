import type { Component, PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { injectModalRootContext } from './modalRoot'

export const destylerModalDescriptionProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'p',
  },
}

export const DestylerModalDescription = defineComponent({
  name: 'DestylerModalDescription',
  props: destylerModalDescriptionProps,
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
      [BindOnceDirective, { id: this.rootContext.descriptionId }],
    ])
  },
})
