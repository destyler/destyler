import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectDialogRootContext } from './root'

export const destylerDialogDescriptionProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'p',
  },
} as const

export type DestylerDialogDescriptionProps = ExtractPublicPropTypes<typeof destylerDialogDescriptionProps>

export const DestylerDialogDescription = defineComponent({
  name: 'DestylerDialogDescription',
  props: destylerDialogDescriptionProps,
  setup() {
    const rootContext = injectDialogRootContext()

    useForwardExpose()
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
