import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const dialogTitleProps = {
  ...primitiveProps,
  /**
   * @default h2
   */
  as: {
    ...primitiveProps.as,
    default: 'h2',
  },
} as const

export type DialogTitleProps = ExtractPublicPropTypes<typeof dialogTitleProps>

export const DialogTitle = defineComponent({
  name: 'DestylerDialogTitle',
  props: dialogTitleProps,
  setup() {
    useForwardExpose()
    const rootContext = injectDialogRootContext()

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
