import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const modalTitleProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'h2',
  },
} as const

export type ModalTitleProps = ExtractPublicPropTypes<typeof modalTitleProps>

export const ModalTitle = defineComponent({
  name: 'DestylerModalTitle',
  props: modalTitleProps,
  setup() {
    const rootContext = injectModalRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return withDirectives(h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.titleId }],
    ])
  },
})
