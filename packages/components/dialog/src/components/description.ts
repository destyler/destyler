import type { Component, PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'

export const destylerDialogDescriptionProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'p',
  },
} as const

export type DestylerDialogDescriptionProps = ExtractPublicPropTypes<typeof destylerDialogDescriptionProps>

export const DestylerDialogDescription = defineComponent({
  name: 'DestylerDialogDescription',
  props: destylerDialogDescriptionProps,
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
    }, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.rootContext.descriptionId }],
    ])
  },
})
