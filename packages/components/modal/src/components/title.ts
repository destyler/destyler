import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const destylerModalTitleProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'h2',
  },
} as const

export type DestylerModalTitleProps = ExtractPublicPropTypes<typeof destylerModalTitleProps>

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
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.titleId }],
    ])
  },
})
