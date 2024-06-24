import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const destylerDialogTitleProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'h2',
  },
} as const

export type DestylerDialogTitleProps = ExtractPublicPropTypes<typeof destylerDialogTitleProps>

export const DestylerDialogTitle = defineComponent({
  name: 'DestylerDialogTitle',
  props: destylerDialogTitleProps,
  setup() {
    useForwardExpose()
    const rootContext = injectDialogRootContext()

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
