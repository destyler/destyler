import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const dialogDescriptionProps = {
  ...primitiveProps,
  /**
   * @default p
   */
  as: {
    ...primitiveProps.as,
    default: 'p',
  },
} as const

export type DialogDescriptionProps = ExtractPublicPropTypes<typeof dialogDescriptionProps>

export const DialogDescription = defineComponent({
  name: 'DestylerDialogDescription',
  props: dialogDescriptionProps,
  setup() {
    const rootContext = injectDialogRootContext()

    useForwardExpose()
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
