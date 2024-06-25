import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalDescriptionProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'p',
  },
} as const

export type DestylerModalDescriptionProps = ExtractPublicPropTypes<typeof destylerModalDescriptionProps>

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
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.descriptionId }],
    ])
  },
})
