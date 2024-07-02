import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const modalDescriptionProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'p',
  },
} as const

export type ModalDescriptionProps = ExtractPublicPropTypes<typeof modalDescriptionProps>

export const ModalDescription = defineComponent({
  name: 'DestylerModalDescription',
  props: modalDescriptionProps,
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
      [BindOnceDirective, { id: this.rootContext.descriptionId }],
    ])
  },
})
